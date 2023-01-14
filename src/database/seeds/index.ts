import { USER_ROLE, USER_LANGUAGE } from '../../entity/user.entity';
import { WAREHOUSE_PRODUCT_SIZE } from '../../entity/warehouseProduct.entity';

export const users = [
  {
    id: 1,
    firstName: 'Simple',
    lastName: 'Admin',
    email: 'admin@gmail.com',
    lang: USER_LANGUAGE.UK,
    salt: '4774818f832fcca717c32b30c2d64603',
    // 123456
    password:
      '303c41df4ef1c02f551d909d80790c2848f703589d02a8c89e515b032d5f996fa52e0723f20e55d4062119b7c1b627198eb5b789fde849fa3da6a2b39dac21a6',
    role: USER_ROLE.ADMIN,
    isVerify: 1,
    isActive: 1,
  },
  {
    id: 2,
    firstName: 'Simple',
    lastName: 'User',
    email: 'user@gmail.com',
    salt: '4774818f832fcca717c32b30c2d64603',
    // 123456
    password:
      '303c41df4ef1c02f551d909d80790c2848f703589d02a8c89e515b032d5f996fa52e0723f20e55d4062119b7c1b627198eb5b789fde849fa3da6a2b39dac21a6',
    lang: USER_LANGUAGE.UK,
    role: USER_ROLE.USER,
    isVerify: 1,
    isActive: 1,
  },
];

export const properties = [
  { id: 1, alias: 'color', title: 'Колір' },
  { id: 2, alias: 'size', title: 'Розмір' },
  { id: 3, alias: 'composition', title: 'Склад' },
];

export const propertyValues = [
  { id: 1, propertyId: 1, alias: 'white', title: 'Білий' },
  { id: 2, propertyId: 1, alias: 'black', title: 'Чорний' },
  { id: 3, propertyId: 1, alias: 'red', title: 'Червоний' },
  { id: 4, propertyId: 3, alias: 'cotton', title: 'Бавовна' },
];

export const categories = [
  {
    id: 1024,
    alias: 'cardigans',
    singleTitle: 'Джемпер',
    multipleTitle: 'Джемпери',
    description: 'Джемпер описание',
    isActive: 1,
  },
  {
    id: 1074,
    alias: 'pullovers',
    singleTitle: 'Светр',
    multipleTitle: 'Светри',
    description: 'Светр описание',
    isActive: 1,
  },
  {
    id: 1165,
    alias: 'hoodies',
    singleTitle: 'Толстовка з капюшоном',
    multipleTitle: 'Толстовки з капюшоном',
    description: 'Толстовка з капюшоном описание',
    isActive: 1,
  },
  {
    id: 1187,
    alias: 't-shorts',
    singleTitle: 'Футболка',
    multipleTitle: 'Футболки',
    description: 'Футболка описание',
    isActive: 1,
  },
  {
    id: 1231,
    alias: 'shorts',
    singleTitle: 'Шорти',
    multipleTitle: 'Шорти',
    description: 'Шорти описание',
    isActive: 1,
  },
  {
    id: 1246,
    alias: 'pants',
    singleTitle: 'Штани',
    multipleTitle: 'Штани',
    description: 'Штани описание',
    isActive: 1,
  },
];

export const products = [
  {
    id: 1,
    categoryId: categories[2].id,
    alias: 'krasnaya_hoodie',
    title: 'Красная Худи',
    description: 'Описание красные худи',
    isActive: 1,
  },
  {
    id: 5,
    categoryId: categories[2].id,
    alias: 'chornaya_hoodie',
    title: 'Чорна Худи',
    description: 'Описание чорных худи',
    isActive: 1,
  },
  {
    id: 6,
    categoryId: categories[3].id,
    alias: 'belaya_fytbolka',
    title: 'Белая футболка',
    description: 'Описание белых футболок',
    isActive: 1,
  }
];

export const similarProducts = [
  { productId: products[0].id, similarProductId: products[1].id },
  { productId: products[1].id, similarProductId: products[0].id },
];

export const productProperties = [
  { productId: products[0].id, propertyId: properties[0].id, propertyValueId: propertyValues[2].id },
  { productId: products[0].id, propertyId: properties[2].id, propertyValueId: propertyValues[3].id },
  { productId: products[1].id, propertyId: properties[0].id, propertyValueId: propertyValues[1].id },
  { productId: products[1].id, propertyId: properties[2].id, propertyValueId: propertyValues[3].id },
  { productId: products[2].id, propertyId: properties[0].id, propertyValueId: propertyValues[0].id },
  { productId: products[2].id, propertyId: properties[2].id, propertyValueId: propertyValues[3].id },
];

export const coupons = [
  { id: 1, type: 'single', code: 'HAPPY_NEW', discountType: 'percent', discount: 25 },
  { id: 2, type: 'multiple', code: 'PROGRAMMER_DAY', discountType: 'price', discount: 500 },
  { id: 3, type: 'multiple', code: '8_MARCH', discountType: 'percent', discount: 10 },
];

export const orders = [
  {
    id: 1,
    email: 'test@test.com',
    firstName: 'Jura',
    lastName: 'Zubach',
    phone: '103',
    city: 'Kyiv',
    region: 'Kyiv region',
    couponId: coupons[0].id,
    approved: 1,
    type: 'open',
    payment: 'un_paid',
  },
  {
    id: 2,
    email: 'test@test.com',
    firstName: 'Jura 2',
    lastName: 'Zubach 2',
    phone: '10322',
    city: 'Kyiv',
    region: 'Kyiv region',
    couponId: coupons[0].id,
    approved: 1,
    type: 'open',
    payment: 'un_paid',
  },
  {
    id: 3,
    email: 'test@test.com',
    firstName: 'Jura 3',
    lastName: 'Zubach 3',
    phone: '103',
    city: 'Kyiv',
    region: 'Kyiv region',
    couponId: coupons[1].id,
    approved: 1,
    type: 'open',
    payment: 'un_paid',
  },
  {
    id: 4,
    email: 'test@test.com',
    firstName: 'Jura 3',
    lastName: 'Zubach 3',
    phone: '103',
    city: 'Kyiv',
    region: 'Kyiv region',
    couponId: null,
    approved: 1,
    type: 'open',
    payment: 'un_paid',
  },
  {
    id: 5,
    email: 'test@test.com',
    firstName: 'Jura 3',
    lastName: 'Zubach 3',
    phone: '103',
    city: 'Kyiv',
    region: 'Kyiv region',
    couponId: null,
    approved: 1,
    type: 'open',
    payment: 'un_paid',
  },
];
export const orderProducts = [
  {
    orderId: orders[0].id,
    productId: products[0].id,
    quantity: 5,
    price: 700,
    size: WAREHOUSE_PRODUCT_SIZE.M,
  },
  {
    orderId: orders[0].id,
    productId: products[1].id,
    quantity: 2,
    price: 1200,
    size: WAREHOUSE_PRODUCT_SIZE.M,
  },
  {
    orderId: orders[1].id,
    productId: products[2].id,
    quantity: 1,
    price: 900,
    size: WAREHOUSE_PRODUCT_SIZE.M,
  },
  {
    orderId: orders[2].id,
    productId: products[2].id,
    quantity: 1,
    price: 950,
    size: WAREHOUSE_PRODUCT_SIZE.M,
  }
];

export const warehouseProducts = [
  {
    productId: products[0].id,
    quantity: 5,
    price: 700,
    oldPrice: 1000,
    size: WAREHOUSE_PRODUCT_SIZE.M,
  },
  {
    productId: products[1].id,
    quantity: 2,
    price: 1200,
    oldPrice: 1500,
    size: WAREHOUSE_PRODUCT_SIZE.M,
  },
  {
    productId: products[2].id,
    quantity: 1,
    price: 900,
    oldPrice: 1100,
    size: WAREHOUSE_PRODUCT_SIZE.M,
  },
  {
    productId: products[2].id,
    quantity: 1,
    price: 950,
    oldPrice: 1250,
    size: WAREHOUSE_PRODUCT_SIZE.M,
  }
];

export const collections = [
  { id: 1, alias: 'nezaleshna', title: 'Незалежна', description: 'Описание', isActive: 1 },
  { id: 2, alias: 'tony-soprano', title: 'Тони сопрано', description: 'Описание', isActive: 1 },
];

export const collectionProducts = [
  { collectionId: collections[0].id, productId: products[0].id },
  { collectionId: collections[0].id, productId: products[1].id },
];
