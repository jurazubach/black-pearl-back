import { DataSource } from 'typeorm';
import * as dataSource from '../../ormconfig';

import {
  users,
  categories,
  properties,
  propertyValues,
  collections,
  collectionProducts,
  productProperties,
  products,
  orderProducts,
  orders,
  coupons,
  similarProducts,
  warehouseProducts,
} from './seeds';
import { CategoryEntity } from 'src/entity/category.entity';
import { UserEntity } from 'src/entity/user.entity';
import { PropertyEntity } from 'src/entity/property.entity';
import { PropertyValueEntity } from 'src/entity/propertyValue.entity';
import { CollectionEntity } from 'src/entity/collection.entity';
import { ProductEntity } from 'src/entity/product.entity';
import { ProductPropertyEntity } from 'src/entity/productProperty.entity';
import { OrderProductEntity } from 'src/entity/orderProduct.entity';
import { CouponEntity } from 'src/entity/coupon.entity';
import { SimilarProductEntity } from 'src/entity/similarProduct.entity';
import { OrderEntity } from 'src/entity/order.entity';
import { CollectionProductEntity } from 'src/entity/collectionProduct.entity';
import { WarehouseProductEntity } from 'src/entity/warehouseProduct.entity';

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

  await insertToTable(connection, CollectionEntity, collections);
  await insertToTable(connection, CollectionProductEntity, collectionProducts);
};

runBootstrap()
  .then(() => console.log('Bootstrap successfully done'))
  .catch((err) => console.log(err))
  .finally(() => process.exit(0));
