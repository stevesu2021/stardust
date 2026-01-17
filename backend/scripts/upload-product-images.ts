import { PrismaClient } from '@prisma/client';
import * as Minio from 'minio';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const prisma = new PrismaClient();

// MinIO 配置
const minioConfig = {
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
  bucketName: process.env.MINIO_BUCKET || 'stardust',
  publicUrl: process.env.MINIO_PUBLIC_URL || '',
};

// 创建 MinIO 客户端
const minioClient = new Minio.Client({
  endPoint: minioConfig.endPoint,
  port: minioConfig.port,
  useSSL: minioConfig.useSSL,
  accessKey: minioConfig.accessKey,
  secretKey: minioConfig.secretKey,
});

// 获取图片文件名（不含路径）从URL
function extractImageFileName(url: string): string {
  // 从URL中提取文件名
  // 例如: https://cbu01.alicdn.com/img/ibank/O1CN01Hl6LEl2DwI0tD61HB_!!2208398578673-0-cib.jpg
  // 提取: O1CN01Hl6LEl2DwI0tD61HB_!!2208398578673-0-cib.jpg
  const parts = url.split('/');
  return parts[parts.length - 1];
}

// 生成MinIO公开URL
function getMinioPublicUrl(objectName: string): string {
  if (minioConfig.publicUrl) {
    return `${minioConfig.publicUrl}/${minioConfig.bucketName}/${objectName}`;
  }
  const protocol = minioConfig.useSSL ? 'https' : 'http';
  return `${protocol}://${minioConfig.endPoint}:${minioConfig.port}/${minioConfig.bucketName}/${objectName}`;
}

// 上传单个文件到MinIO
async function uploadImageToMinio(filePath: string, fileName: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const objectName = `products/${Date.now()}-${fileName}`;

  await minioClient.putObject(
    minioConfig.bucketName,
    objectName,
    fileBuffer,
    fileBuffer.length,
    { 'Content-Type': 'image/jpeg' }
  );

  return getMinioPublicUrl(objectName);
}

// 主函数
async function uploadProductImages() {
  const imagesDir = path.join(__dirname, '../../images');

  // 读取images目录下的所有文件
  const imageFiles = fs.readdirSync(imagesDir).filter(f =>
    f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')
  );

  console.log(`找到 ${imageFiles.length} 个图片文件`);

  // 获取所有商品
  const products = await prisma.product.findMany();
  console.log(`数据库中有 ${products.length} 个商品`);

  let uploaded = 0;
  let skipped = 0;

  for (const product of products) {
    // 从商品imageUrl中提取文件名
    const targetFileName = extractImageFileName(product.imageUrl);

    // 查找匹配的本地文件
    const matchedFile = imageFiles.find(f => {
      // 精确匹配
      if (f === targetFileName) return true;
      // 包含匹配（处理URL中可能有路径的情况）
      if (targetFileName.includes(f) || f.includes(targetFileName)) return true;
      return false;
    });

    if (matchedFile) {
      try {
        const localFilePath = path.join(imagesDir, matchedFile);

        // 检查文件是否存在
        if (!fs.existsSync(localFilePath)) {
          console.log(`⚠ 文件不存在: ${matchedFile}`);
          skipped++;
          continue;
        }

        console.log(`上传: ${matchedFile} -> 商品: ${product.title.substring(0, 30)}...`);

        // 上传到MinIO
        const minioUrl = await uploadImageToMinio(localFilePath, matchedFile);

        // 更新数据库
        await prisma.product.update({
          where: { id: product.id },
          data: { imageUrl: minioUrl },
        });

        console.log(`✓ 上传成功: ${minioUrl}`);
        uploaded++;
      } catch (error) {
        console.error(`✗ 上传失败: ${matchedFile}`, error);
        skipped++;
      }
    } else {
      console.log(`⚠ 未找到匹配图片: ${targetFileName}`);
      skipped++;
    }
  }

  console.log(`\n完成! 上传: ${uploaded}, 跳过: ${skipped}`);
}

uploadProductImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
