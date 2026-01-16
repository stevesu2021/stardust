import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit, OnModuleDestroy {
  private client: Minio.Client | null = null;
  private bucketName: string;
  private isEnabled: boolean = false;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET') || 'stardust';

    try {
      this.client = new Minio.Client({
        endPoint: this.configService.get<string>('MINIO_ENDPOINT') || 'localhost',
        port: parseInt(this.configService.get<string>('MINIO_PORT') || '9000'),
        useSSL: this.configService.get<string>('MINIO_USE_SSL') === 'true',
        accessKey: this.configService.get<string>('MINIO_ACCESS_KEY') || '',
        secretKey: this.configService.get<string>('MINIO_SECRET_KEY') || '',
      });
      this.isEnabled = true;
    } catch (error) {
      console.warn('MinIO client 初始化失败，将禁用文件上传功能:', error);
      this.client = null;
      this.isEnabled = false;
    }
  }

  async onModuleInit() {
    if (!this.client || !this.isEnabled) {
      console.warn('MinIO 未启用，文件上传功能将被禁用');
      return;
    }

    try {
      // 检查 bucket 是否存在，不存在则创建
      const exists = await this.client.bucketExists(this.bucketName);
      if (!exists) {
        await this.client.makeBucket(this.bucketName);
        console.log(`MinIO bucket "${this.bucketName}" created successfully`);

        // 设置 bucket 为公开读取策略
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };
        await this.client.setBucketPolicy(this.bucketName, JSON.stringify(policy));
      } else {
        console.log(`MinIO bucket "${this.bucketName}" already exists`);
      }
    } catch (error) {
      console.warn('MinIO 初始化失败，文件上传功能将被禁用:', error);
      this.isEnabled = false;
    }
  }

  async onModuleDestroy() {
    // MinIO client 不需要显式关闭
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folder: string = 'palm-readings',
  ): Promise<string> {
    if (!this.client || !this.isEnabled) {
      throw new Error('MinIO 未启用，无法上传文件');
    }

    const objectName = `${folder}/${Date.now()}-${fileName}`;

    await this.client.putObject(this.bucketName, objectName, fileBuffer, fileBuffer.length, {
      'Content-Type': mimeType,
    });

    // 返回公开访问的 URL，优先使用 MINIO_PUBLIC_URL 配置
    const publicUrl = this.configService.get<string>('MINIO_PUBLIC_URL');
    if (publicUrl) {
      return `${publicUrl}/${this.bucketName}/${objectName}`;
    }

    const port = this.configService.get<string>('MINIO_PORT');
    const useSSL = this.configService.get<string>('MINIO_USE_SSL') === 'true';
    const protocol = useSSL ? 'https' : 'http';
    const host = this.configService.get<string>('MINIO_ENDPOINT') || 'localhost';
    return `${protocol}://${host}:${port}/${this.bucketName}/${objectName}`;
  }

  async deleteFile(objectName: string): Promise<void> {
    if (!this.client || !this.isEnabled) {
      console.warn('MinIO 未启用，跳过文件删除');
      return;
    }

    await this.client.removeObject(this.bucketName, objectName);
  }

  extractObjectNameFromUrl(url: string): string {
    // 从完整 URL 中提取对象名称
    // 支持多种路径格式
    const match = url.match(/\/stardust\/(.+)$/);
    return match ? match[1] : '';
  }

  isMinioEnabled(): boolean {
    return this.isEnabled && this.client !== null;
  }
}
