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

@Injectable()
export class ProductBloc {
  deleteProduct: any;
  constructor(
    private readonly productService: ProductService,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(ProductBloc.name);
  }

  @Transactional()
  async createProduct({ userId: currentUserId }: CtxReq, req: ProductCreateReq): Promise<number> {
    const { name, description, price, quantity, color, rom, ram, categoryId } = req;
    this.log.info(`Create product with name #${name} and description #${description}`);

    const existProduct = await this.productService.getByName(name);
    if (existProduct) {
      throw new ValidatorException(
        `Product with name ${name} already exists`,
        ErrorCode.PRODUCT_ALREADY_EXIST,
      );
    }

    const product = await this.productService.save({
      name,
      description,
      price,
      quantity,
      color,
      rom,
      ram,
      categoryId,
      createdBy: currentUserId,
      updatedBy: currentUserId,
    } as Product);

    return product.id;
  }

  async searchProducts(req: FetchProductReq): Promise<Page<Product>> {
    this.log.info(`Fetch all products by req #`, req);
    const { keyword} = req;
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
    product.price = req.price || product.price;
    product.quantity = req.quantity || product.quantity;
    product.color = req.color || product.color;
    product.rom = req.rom || product.rom;
    product.ram = req.ram || product.ram;
    product.categoryId = req.categoryId || product.categoryId;
    product.updatedBy = currentUserId;

    await this.productService.save(product);
  }
}
