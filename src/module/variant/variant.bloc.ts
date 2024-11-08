import { Injectable } from '@nestjs/common';
import { VariantService } from './variant.service';
import { ColorService } from '@module/color/color.service';
import { RomService } from '@module/rom/rom.service';
import { ProductService } from '@module/product/product.service';
import { CtxReq } from '@security/request-context/request-context.dto';
import { NotFoundException } from '@exception/not-found.exception';
import { PageRequest } from '@share/page/page-request';
import { Variant } from '@entity/variant.entity';
import { Page } from '@share/page/page';
import { VariantCreateReq } from './dto/req/variant-create.req';
import { AppLogger } from '@config/logger/app-logger.config';
import { ErrorCode } from '@share/constant/error-code';
import { ValidatorException } from '@exception/validator.exception';
import { FetchVariantReq } from './dto/req/fetch-variant.req';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class VariantBloc {
  constructor(
    private readonly variantService: VariantService,
    private readonly colorService: ColorService,
    private readonly romService: RomService,
    private readonly productService: ProductService,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(VariantBloc.name);
  }

  @Transactional()
  async createVariant({ userId: currentUserId }: CtxReq, req: VariantCreateReq): Promise<number> {
    const { colorId, romId, productId, price, stock } = req;
    this.log.info(`Create Variant with color #${colorId}, rom #${romId}, product #${productId}, price #${price}, and stock #${stock}`);

    const product = await this.productService.getById(productId);
    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found.`);
    }

    const color = await this.colorService.getById(colorId);
    if (!color) {
      throw new NotFoundException(`Color with id ${colorId} not found.`);
    }

    const rom = await this.romService.getById(romId);
    if (!rom) {
      throw new NotFoundException(`Rom with id ${romId} not found.`);
    }

    const existingVariant = await this.variantService.getByProductColorRom(productId, colorId, romId);
    if (existingVariant) {
      throw new ValidatorException(
        `Variant with productId ${productId}, colorId ${colorId}, and romId ${romId} already exists.`,
        ErrorCode.VARIANT_ALREADY_EXISTS,
      );
    }

    const variant = new Variant();
    variant.product = product;
    variant.color = color;
    variant.rom = rom;
    variant.price = price;
    variant.stock = stock;
    variant.createdBy = currentUserId;
    variant.updatedBy = currentUserId;

    const savedVariant = await this.variantService.save(variant);

    return savedVariant.id;
  }

  async searchVariants(req: FetchVariantReq): Promise<Page<Variant>> {
    this.log.info(`Fetch all variants by req #`, req);
    const { keyword } = req;
    const pageRequest = PageRequest.ofRequest(req);
    return this.variantService.fetchVariants(keyword, pageRequest);
  }

  async getById(id: number): Promise<Variant> {
    this.log.info(`Get variant by id #${id}`);
    const variant = await this.variantService.getById(id);
    if (!variant) {
      throw new NotFoundException(`Variant with id ${id} not found`);
    }
    return variant;
  }

  @Transactional()
  async updateVariant(id: number, req: VariantCreateReq, currentUserId: number): Promise<void> {
    this.log.info(`Update variant by id #${id}`);

    const variant = await this.getById(id);
    const { colorId, romId, productId, price, stock } = req;

    if (colorId) {
      const color = await this.colorService.getById(colorId);
      if (!color) {
        throw new NotFoundException(`Color with id ${colorId} not found.`);
      }
      variant.color = color;
    }

    if (romId) {
      const rom = await this.romService.getById(romId);
      if (!rom) {
        throw new NotFoundException(`Rom with id ${romId} not found.`);
      }
      variant.rom = rom;
    }

    if (productId) {
      const product = await this.productService.getById(productId);
      if (!product) {
        throw new NotFoundException(`Product with id ${productId} not found.`);
      }
      variant.product = product;
    }

    variant.price = price || variant.price;
    variant.stock = stock || variant.stock;
    variant.updatedBy = currentUserId;

    await this.variantService.save(variant);
  }

  @Transactional()
  async deleteVariant(id: number): Promise<void> {
    this.log.info(`Delete variant by id: ${id}`);
    const variant = await this.variantService.getById(id);

    if (!variant) {
      throw new NotFoundException(`Variant with id ${id} not found.`);
    }

    await this.variantService.remove(id);
    this.log.info(`Variant with id ${id} successfully deleted.`);
  }
}
