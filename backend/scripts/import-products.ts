import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

async function importProducts() {
  const filePath = path.join(__dirname, '../../选品池导出.xlsx');

  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  // Convert to objects
  const data = XLSX.utils.sheet_to_json(worksheet) as Array<any>;

  console.log(`解析到 ${data.length} 个商品`);

  const products = data.map((row: any) => {
    // 清理价格，移除可能的非数字字符
    let price = 0;
    if (typeof row['商品价格'] === 'string') {
      price = parseFloat(row['商品价格'].replace(/[^\d.]/g, '')) || 0;
    } else if (typeof row['商品价格'] === 'number') {
      price = row['商品价格'];
    }

    return {
      title: row['商品标题'] || '',
      productId: String(row['商品ID'] || ''),
      productUrl: row['商品链接'] || '',
      imageUrl: row['图片地址'] || '',
      price: price,
      platform: row['平台'] || '1688',
      shopName: row['店铺名称'] || '',
      category: row['所属分组'] || '其他',
      tags: row['标签'] !== '-' ? row['标签'] : null,
      remark: row['备注'] !== '-' ? row['备注'] : null,
    };
  });

  // 导入商品
  let imported = 0;
  let skipped = 0;

  for (const product of products) {
    try {
      await prisma.product.upsert({
        where: {
          productId_platform: {
            productId: product.productId,
            platform: product.platform,
          },
        },
        update: {
          title: product.title,
          productUrl: product.productUrl,
          imageUrl: product.imageUrl,
          price: product.price,
          shopName: product.shopName,
          category: product.category,
          tags: product.tags,
          remark: product.remark,
        },
        create: product,
      });
      imported++;
      console.log(`✓ ${product.title.substring(0, 30)}...`);
    } catch (error) {
      console.error(`✗ 失败: ${product.title}`, error);
      skipped++;
    }
  }

  console.log(`\n导入完成: ${imported} 个成功, ${skipped} 个跳过`);

  // 按分类统计
  const allProducts = await prisma.product.findMany();
  const categoryStats: Record<string, number> = {};
  allProducts.forEach(p => {
    categoryStats[p.category] = (categoryStats[p.category] || 0) + 1;
  });

  console.log('\n各分类商品数量:');
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`${category}: ${count} 个`);
  });
}

importProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
