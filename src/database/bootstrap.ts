import { createConnection, Connection } from 'typeorm';
import * as config from '../../ormconfig';

import { users, categories, properties, propertyValues, collections } from './seeds';
import { CategoryEntity } from '../entity/category.entity';
import { UserEntity } from '../entity/user.entity';
import { PropertyEntity } from '../entity/property.entity';
import { PropertyValueEntity } from '../entity/propertyValue.entity';
import { CollectionEntity } from '../entity/collection.entity';

const insertToTable = async (connection: Connection, entity: any, data: any) => {
  try {
    await connection.createEntityManager().createQueryBuilder().insert().into(entity).values(data).execute();
  } catch (e) {
    console.log('error', e);
  }
};

const runBootstrap = async () => {
  const connection = await createConnection(config as any);

  await insertToTable(connection, CategoryEntity, categories);
  await insertToTable(connection, UserEntity, users);
  await insertToTable(connection, PropertyEntity, properties);
  await insertToTable(connection, PropertyValueEntity, propertyValues);
  await insertToTable(connection, CollectionEntity, collections);
};

runBootstrap()
  .then(() => console.log('Bootstrap successfully done'))
  .catch((err) => console.log(err))
  .finally(() => process.exit(0));
