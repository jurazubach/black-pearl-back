import { DataSource } from 'typeorm';
import * as dataSource from '../../ormconfig';

import {
  users,
  categories,
  properties,
  propertyValues,
  productProperties,
  products,
  orderProducts,
  orders,
  banners,
  socials,
  articles,
  coupons,
  similarProducts,
  warehouseProducts,
} from './seeds';
import { CategoryEntity } from '../entity/category.entity';
import { UserEntity } from '../entity/user.entity';
import { PropertyEntity } from '../entity/property.entity';
import { PropertyValueEntity } from '../entity/propertyValue.entity';
import { ProductEntity } from '../entity/product.entity';
import { ProductPropertyEntity } from '../entity/productProperty.entity';
import { OrderProductEntity } from '../entity/orderProduct.entity';
import { CouponEntity } from '../entity/coupon.entity';
import { SimilarProductEntity } from '../entity/similarProduct.entity';
import { OrderEntity } from '../entity/order.entity';
import { WarehouseProductEntity } from '../entity/warehouseProduct.entity';
import { BannerEntity } from '../entity/banner.entity';
import { SocialEntity } from '../entity/social.entity';
import { ArticleEntity } from '../entity/article.entity';

const insertToTable = async (connection: DataSource, entity: any, data: any) => {
  try {
    await connection.createEntityManager().createQueryBuilder().insert().into(entity).values(data).execute();
  } catch (e) {
    console.log('error', e);
  }
};

const runBootstrap = async () => {
  const connection = await dataSource.default.initialize();

  await insertToTable(connection, CategoryEntity, categories);
  await insertToTable(connection, UserEntity, users);
  await insertToTable(connection, PropertyEntity, properties);
  await insertToTable(connection, PropertyValueEntity, propertyValues);
  await insertToTable(connection, CouponEntity, coupons);

  await insertToTable(connection, ProductEntity, products);
  await insertToTable(connection, ProductPropertyEntity, productProperties);
  await insertToTable(connection, SimilarProductEntity, similarProducts);
  await insertToTable(connection, WarehouseProductEntity, warehouseProducts);

  await insertToTable(connection, OrderEntity, orders);
  await insertToTable(connection, OrderProductEntity, orderProducts);

  await insertToTable(connection, BannerEntity, banners);
  await insertToTable(connection, SocialEntity, socials);
  await insertToTable(connection, ArticleEntity, articles);

  await connection.query(`ALTER TABLE products ADD FULLTEXT (code)`);
  await connection.query(`ALTER TABLE products ADD FULLTEXT (title)`);
};

runBootstrap()
  .then(() => console.log('Bootstrap successfully done'))
  .catch((err) => console.log(err))
  .finally(() => process.exit(0));
