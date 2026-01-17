import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // 获取商品列表（分页，可选按分类筛选）
  async getList(skip = 0, take = 20, category?: string) {
    const where = category ? { category } : {};

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      skip,
      take,
    };
  }

  // 获取商品详情
  async getById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  // 获取所有分类
  async getCategories() {
    const products = await this.prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    return products.map(p => p.category);
  }

  // 批量导入商品
  async importProducts(products: Array<{
    title: string;
    productId: string;
    productUrl: string;
    imageUrl: string;
    price: number;
    platform: string;
    shopName: string;
    category: string;
    tags?: string;
    remark?: string;
  }>) {
    let imported = 0;
    let skipped = 0;

    for (const product of products) {
      try {
        // 使用 upsert 避免重复导入
        await this.prisma.product.upsert({
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
      } catch (error) {
        console.error(`Failed to import product ${product.productId}:`, error);
        skipped++;
      }
    }

    return { imported, skipped };
  }

  // 删除所有商品（慎用）
  async deleteAll() {
    return this.prisma.product.deleteMany({});
  }
}
