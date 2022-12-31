import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _capitalize from 'lodash/capitalize';
import _get from 'lodash/get';
import glob from 'glob';
import { CategoryEntity } from '../../entity/category.entity';
import { ProductEntity } from '../../entity/product.entity';
import { CollectionEntity } from '../../entity/collection.entity';
import { ProductPropertyEntity } from '../../entity/productProperty.entity';
import { PropertyEntity } from '../../entity/property.entity';
import { PropertyValueEntity } from '../../entity/propertyValue.entity';
import { ConfigService } from '@nestjs/config';
import fs from 'fs/promises';
import _last from 'lodash/last';
import { CollectionProductEntity } from '../../entity/collectionProduct.entity';

export interface IProductProperty {
  propertyAlias: string;
  propertyValueAlias: string;
}

export interface IProperty {
  alias: string;
  title: string;
}

export interface IPropertyValue extends IProperty {
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: Repository<CollectionEntity>,
    @InjectRepository(ProductPropertyEntity)
    private readonly productPropertyRepository: Repository<ProductPropertyEntity>,
    private readonly i18n: I18nService,
    private readonly configService: ConfigService
  ) {
  }

  async getProduct(alias: string, lang: string) {
    const product = await this.productRepository
      .createQueryBuilder('p')
      .select(`
        p.id, p.alias,
        p.singleTitle${_capitalize(lang)} as singleTitle,
        p.multipleTitle${_capitalize(lang)} as multipleTitle,
        p.description${_capitalize(lang)} as description,
        JSON_OBJECT('id', c.id, 'alias', c.alias) as category
        `)
      .where('p.alias = :alias AND p.isActive = 1', { alias })
      .innerJoin(CategoryEntity, 'c', 'c.id = p.categoryId')
      .getRawOne<ProductEntity>();

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const { category, ...restProduct } = product;
    const categoryTrans = await this.i18n.t(`categories.${category.alias}`, { lang });
    Object.assign(category, categoryTrans);

    const properties = await this.getProductProperties(product['id'], lang);
    const images = await this.getProductImages(alias);
    const collection = await this.getProductCollection(product['id'], lang);

    if (collection) {
      const collectionImages = await this.getCollectionImages(collection.alias);
      Object.assign(collection, { images: collectionImages });
    }

    return {
      ...restProduct,
      category,
      collection,
      properties,
      images,
    };
  }

  async getProductImages(productAlias: string) {
    const paths: string[] = [];

    const protocol = this.configService.get<string>("API_PROTOCOL");
    const host = this.configService.get<string>("API_HOST");
    const port = this.configService.get<string>("API_PORT");
    const portPart = port ? `:${port}` : "";
    const hostname = `${protocol}://${host}${portPart}/images/products/${productAlias}`;

    const files = glob.sync(`src/public/images/products/${productAlias}/*`, { realpath: true });
    for await (const filePath of files) {
      const image = _last(filePath.split('/'));
      paths.push(`${hostname}/${image}`);
    }

    return paths;
  }

  async getCollectionImages(collectionAlias: string) {
    const paths: string[] = [];

    const protocol = this.configService.get<string>("API_PROTOCOL");
    const host = this.configService.get<string>("API_HOST");
    const port = this.configService.get<string>("API_PORT");
    const portPart = port ? `:${port}` : "";
    const hostname = `${protocol}://${host}${portPart}/images/collections/${collectionAlias}`;

    const files = glob.sync(`src/public/images/collections/${collectionAlias}/*`, { realpath: true });
    for await (const filePath of files) {
      const image = _last(filePath.split('/'));
      paths.push(`${hostname}/${image}`);
    }

    return paths;
  }

  async getProductCollection(productId: number, lang: string) {
    const collection = await this.collectionRepository
      .createQueryBuilder('c')
      .select(`c.id, c.alias`)
      .innerJoin(CollectionProductEntity, 'cp', 'cp.productId = :productId', { productId })
      .getRawOne<CollectionEntity>();

    if (!collection) {
      return null;
    }

    const collectionTrans = await this.i18n.t(`collections.${collection.alias}`, { lang });

    return {
      ...collection,
      ...collectionTrans,
    };
  }

  async getProductProperties(productId: number, lang: string) {
    const productProperties = await this.productPropertyRepository
      .createQueryBuilder('pp')
      .select(`property.alias as propertyAlias, propertyValue.alias as propertyValueAlias`)
      .where('product.id = :id AND product.isActive = 1', { id: productId })
      .innerJoin(ProductEntity, 'product', 'product.id = pp.productId')
      .innerJoin(PropertyEntity, 'property', 'property.id = pp.propertyId')
      .innerJoin(PropertyValueEntity, 'propertyValue', 'propertyValue.id = pp.propertyValueId AND propertyValue.propertyId = property.id')
      .getRawMany<IProductProperty>();

    const properties: { property: IProperty, value: IPropertyValue }[] = [];

    for await (const { propertyAlias, propertyValueAlias } of productProperties) {
      const propertyTrans = await this.i18n.t(`properties.${propertyAlias}`, { lang });
      const propertyValueTrans = await this.i18n.t(`propertyValues.${propertyValueAlias}`, { lang });

      properties.push({
        property: {
          title: propertyTrans && propertyTrans.title ? propertyTrans.title : propertyAlias,
          alias: propertyAlias,
        },
        value: {
          title: propertyValueTrans && propertyValueTrans.title ? propertyValueTrans.title : propertyValueAlias,
          alias: propertyValueAlias,
        },
      });
    }

    return properties;
  }
}
