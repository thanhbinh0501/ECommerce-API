import { Injectable } from '@nestjs/common';
import { ProductService } from './product.service';
import { Transactional } from 'typeorm-transactional';
import { CtxReq } from '@security/request-context/request-context.dto';
import { NotFoundException } from '@exception/not-found.exception';
import { PageRequest } from '@share/page/page-request';
import { Product } from '@entity/product.entity';
import { Page } from '@share/page/page';
import { ProductCreateReq } from './dto/req/product-create.req';
import { AppLogger } from '@config/logger/app-logger.config';
import { ErrorCode } from '@share/constant/error-code';
import { ValidatorException } from '@exception/validator.exception';
import { FetchProductReq } from './dto/req/fetch-product.req';
import { Variant } from '@entity/variant.entity';

@Injectable()
export class ProductBloc {
  constructor(
    private readonly productService: ProductService,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(ProductBloc.name);
  }

  @Transactional()
  async createProduct({ userId: currentUserId }: CtxReq, req: ProductCreateReq): Promise<number> {
    const { name, description, categoryId, colorId, romId, price, stock } = req;
    this.log.info(`Create product with name #${name} and description #${description}`);

    const existProduct = await this.productService.getByName(name);
    if (existProduct) {
      throw new ValidatorException(
        `Product with name ${name} already exists`,
        ErrorCode.PRODUCT_ALREADY_EXIST,
      );
    }

    const category = await this.productService.getCategoryById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    const color = await this.productService.getColorById(colorId);
    if (!color) {
      throw new NotFoundException(`Color with id ${colorId} not found`);
    }

    const rom = await this.productService.getRomById(romId);
    if (!rom) {
      throw new NotFoundException(`ROM with id ${romId} not found`);
    }

    const product = new Product();
    product.name = name;
    product.description = description;
    product.category = category;
    product.createdBy = currentUserId;
    product.updatedBy = currentUserId;

    const savedProduct = await this.productService.save(product);

    const variant = new Variant();
    variant.product = savedProduct;
    variant.color = color;
    variant.rom = rom;
    variant.price = price;
    variant.stock = stock;
    variant.createdBy = currentUserId;
    variant.updatedBy = currentUserId;

    await this.productService.saveVariant(variant);

    return savedProduct.id;
  }

  async searchProducts(req: FetchProductReq): Promise<Page<Product>> {
    this.log.info(`Fetch all products by req #`, req);
    const { keyword } = req;
    const pageRequest = PageRequest.ofRequest(req);
    return this.productService.fetchProducts(keyword, pageRequest);
  }

  async getById(id: number): Promise<Product> {
    this.log.info(`Get product by id #${id}`);
    const product = await this.productService.getById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  @Transactional()
  async updateProduct(id: number, req: ProductCreateReq, currentUserId: number): Promise<void> {
    this.log.info(`Update product by id #${id}`);

    const product = await this.getById(id);
    product.name = req.name || product.name;
    product.description = req.description || product.description;
    product.updatedBy = currentUserId;

    await this.productService.save(product);
  }

  @Transactional()
  async deleteProduct(id: number): Promise<void> {
    this.log.info(`Delete product by id: ${id}`);
    const product = await this.productService.getById(id);

    if (!product) {
      throw new Error(`Product with id ${id} not found.`);
    }

    await this.productService.remove(id);
    this.log.info(`Product with id ${id} successfully deleted.`);
  }
}
