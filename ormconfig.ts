import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
dotenv.config();

const config: TypeOrmModuleOptions = {
  type: process.env.DB_DIALECT as 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  charset: process.env.DB_CHARSET,
  logging: true,
  entities: ['src/entity/*.ts'],
  migrations: ['src/database/migration/**/*.ts'],
  subscribers: ['src/database/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/database/migration',
    subscribersDir: 'src/database/subscriber',
  },
};

module.exports = config;
