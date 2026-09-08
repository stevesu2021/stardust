import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  // 获取商品列表
  @Get()
  async getList(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('category') category?: string,
  ) {
    // NestJS 装饰器参数即使缺省也会显式传入 undefined，TS 参数默认值不生效，需手动兜底
    return this.productService.getList(Number(skip ?? 0), Number(take ?? 20), category);
  }

  // 获取商品详情
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.productService.getById(id);
  }

  // 获取所有分类
  @Get('categories/list')
  async getCategories() {
    return this.productService.getCategories();
  }

  // 批量导入商品
  @Post('import')
  async importProducts(@Body() data: { products: Array<any> }) {
    return this.productService.importProducts(data.products);
  }

  // 删除所有商品
  @Post('delete-all')
  async deleteAll() {
    return this.productService.deleteAll();
  }
}
