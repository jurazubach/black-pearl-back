import { USER_ROLE, USER_LANGUAGE } from '../../entity/user.entity';

export const users = [
  {
    id: 1,
    firstName: 'Simple',
    lastName: 'Admin',
    email: 'admin@gmail.com',
    lang: USER_LANGUAGE.UK,
    salt: '4774818f832fcca717c32b30c2d64603',
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
    password:
      '303c41df4ef1c02f551d909d80790c2848f703589d02a8c89e515b032d5f996fa52e0723f20e55d4062119b7c1b627198eb5b789fde849fa3da6a2b39dac21a6',
    lang: USER_LANGUAGE.UK,
    role: USER_ROLE.USER,
    isVerify: 1,
    isActive: 1,
  },
];

export const collections = [
  { alias: 'nezaleshna', title: 'Незалежна', description: 'Описание' },
  { alias: 'tony-soprano', title: 'Тони сопрано', description: 'Описание' },
];

export const properties = [
  { id: 1, alias: 'color', title: 'Колір' },
  { id: 2, alias: 'size', title: 'Розмір' },
  { id: 3, alias: 'composition', title: 'Склад' },
];

export const propertyValues = [
  { propertyId: 1, alias: 'white', title: 'Білий' },
  { propertyId: 1, alias: 'black', title: 'Чорний' },
  { propertyId: 1, alias: 'red', title: 'Червоний' },
  { propertyId: 3, alias: 'cotton', title: 'Бавовна' },
];

export const categories = [
  {
    id: 1024,
    alias: 'cardigans',
    singleTitle: 'Джемпер',
    multipleTitle: 'Джемпери',
    description: 'Джемпер',
    isActive: 1,
  },
  {
    id: 1074,
    alias: 'pullovers',
    singleTitle: 'Светр',
    multipleTitle: 'Светри',
    description: 'Светр',
    isActive: 1,
  },
  {
    id: 1165,
    alias: 'hoodies',
    singleTitle: 'Толстовка з капюшоном',
    multipleTitle: 'Толстовки з капюшоном',
    description: 'Толстовка з капюшоном',
    isActive: 1,
  },
  {
    id: 1187,
    alias: 't-shorts',
    singleTitle: 'Футболка',
    multipleTitle: 'Футболки',
    description: 'Футболка',
    isActive: 1,
  },
  {
    id: 1231,
    alias: 'shorts',
    singleTitle: 'Шорти',
    multipleTitle: 'Шорти',
    description: 'Шорти',
    isActive: 1,
  },
  {
    id: 1246,
    alias: 'pants',
    singleTitle: 'Штани',
    multipleTitle: 'Штани',
    description: 'Штани',
    isActive: 1,
  },
];
