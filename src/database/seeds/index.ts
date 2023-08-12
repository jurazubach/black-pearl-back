import { USER_ROLE, USER_LANGUAGE } from '../../entity/user.entity';
import { WAREHOUSE_PRODUCT_SIZE } from '../../entity/warehouseProduct.entity';
import { EOrderPayment, EOrderPaymentType, EOrderType } from '../../entity/order.entity';

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
  { id: 1, alias: 'composition', title: 'Склад' },
  { id: 2, alias: 'material', title: 'Матеріал' },
  { id: 3, alias: 'sex', title: 'Стать' },
  { id: 4, alias: 'season', title: 'Сезон' },
  { id: 5, alias: 'color', title: 'Колір' },
];

export const propertyValues = [
  // sex
  { id: 1, propertyId: properties[2].id, alias: 'men', title: 'Чоловік' },
  { id: 2, propertyId: properties[2].id, alias: 'women', title: 'Жінка' },
  { id: 3, propertyId: properties[2].id, alias: 'girl', title: 'Дівчинка' },
  { id: 4, propertyId: properties[2].id, alias: 'boy', title: 'Хлопець' },
  // season
  { id: 5, propertyId: properties[3].id, alias: 'winter', title: 'Зима' },
  { id: 6, propertyId: properties[3].id, alias: 'summer', title: 'Літо' },
  { id: 7, propertyId: properties[3].id, alias: 'spring', title: 'Весна' },
  { id: 8, propertyId: properties[3].id, alias: 'fall', title: 'Осінь' },
  { id: 9, propertyId: properties[3].id, alias: 'half-season', title: 'Демисезон' },
  // material
  { id: 10, propertyId: properties[1].id, alias: 'fleece', title: 'Фліс' },
  { id: 11, propertyId: properties[1].id, alias: 'three_threads', title: '3 нитка' },
  { id: 12, propertyId: properties[1].id, alias: 'two_threads', title: '2 нитка' },
  // composition
  { id: 13, propertyId: properties[0].id, alias: 'cotton', title: 'Бавовна 100%' },
  // color
  { id: 14, propertyId: properties[4].id, alias: 'bilyj', title: 'Білий' },
  { id: 15, propertyId: properties[4].id, alias: 'chornyj', title: 'Чорний' },
  { id: 16, propertyId: properties[4].id, alias: 'bezhevyj', title: 'Бежевий' },
  { id: 17, propertyId: properties[4].id, alias: 'chervonyj', title: 'Червоний' },
  { id: 18, propertyId: properties[4].id, alias: 'molochnyj', title: 'Молочний' },
  { id: 19, propertyId: properties[4].id, alias: 'malaxit', title: 'Малахіт' },
  { id: 20, propertyId: properties[4].id, alias: 'kobalt', title: 'Кобальт' },
  { id: 21, propertyId: properties[4].id, alias: 'akvamaryn', title: 'Аквамарин' },
  { id: 22, propertyId: properties[4].id, alias: 'fuksiya', title: 'Фуксія' },
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
    code: '11651',
    categoryId: categories[2].id,
    alias: 'sportyvnyj_kostyum_z_trynytky_molochnyi_zhinochyj',
    title: 'Спортивний костюм The Black Pearl з тринитки молочний жіночий',
    description: 'Гарний та стильний костюм який зігріє тебе в прохолодну погоду. Зручний крій робить дану модель ідеальною для повсякденних справ та активного відпочинку. Костюм виготовлено з якісної тканини яка не кашлатиться та не втрачає колір навіть після багаторазового прання. Поповни свій гардероб яскравою новинкою.',
    isActive: 1,
  },
  {
    id: 2,
    code: '11652',
    categoryId: categories[2].id,
    alias: 'sportyvnyj_kostyum_z_trynytky_malahit_zhinochyj',
    title: 'Спортивний костюм The Black Pearl з тринитки малахіт жіночий',
    description: 'Гарний та стильний костюм який зігріє тебе в прохолодну погоду. Зручний крій робить дану модель ідеальною для повсякденних справ та активного відпочинку. Костюм виготовлено з якісної тканини яка не кашлатиться та не втрачає колір навіть після багаторазового прання. Поповни свій гардероб яскравою новинкою.',
    isActive: 1,
  },
  {
    id: 3,
    code: '11653',
    categoryId: categories[2].id,
    alias: 'sportyvnyj_kostyum_z_trynytky_kobalt_zhinochyj',
    title: 'Спортивний костюм The Black Pearl з тринитки кобальт жіночий',
    description: 'Гарний та стильний костюм який зігріє тебе в прохолодну погоду. Зручний крій робить дану модель ідеальною для повсякденних справ та активного відпочинку. Костюм виготовлено з якісної тканини яка не кашлатиться та не втрачає колір навіть після багаторазового прання. Поповни свій гардероб яскравою новинкою.',
    isActive: 1,
  },
  {
    id: 4,
    code: '11654',
    categoryId: categories[2].id,
    alias: 'sportyvnyj_kostyum_z_trynytky_akvamaryn_zhinochyj',
    title: 'Спортивний костюм The Black Pearl з тринитки аквамарин жіночий',
    description: 'Гарний та стильний костюм який зігріє тебе в прохолодну погоду. Зручний крій робить дану модель ідеальною для повсякденних справ та активного відпочинку. Костюм виготовлено з якісної тканини яка не кашлатиться та не втрачає колір навіть після багаторазового прання. Поповни свій гардероб яскравою новинкою.',
    isActive: 1,
  },
  {
    id: 5,
    code: '11655',
    categoryId: categories[2].id,
    alias: 'sportyvnyj_kostyum_teplyj_na_flisi_fuksiya_zhinochyj',
    title: 'Спортивний костюм The Black Pearl теплий на флісі фуксія жіночий',
    description: 'Теплий, комфортний та стильний костюм на флісі! Базова річ на прохолоді пори року. Якісний, з натуральної тканини та зовсім не парить і не кошлатиться, після прання не втрачає колір. Підходить для повсякденного носіння та активного відпочинку.',
    isActive: 1,
  },
  {
    id: 6,
    code: '11656',
    categoryId: categories[2].id,
    alias: 'sportyvnyj_kostyum_teplyj_na_flisi_akvamaryn_zhinochyj',
    title: 'Спортивний костюм The Black Pearl теплий на флісі аквамарин жіночий',
    description: 'Теплий, комфортний та стильний костюм на флісі! Базова річ на прохолоді пори року. Якісний, з натуральної тканини та зовсім не парить і не кошлатиться, після прання не втрачає колір. Підходить для повсякденного носіння та активного відпочинку.',
    isActive: 1,
  },
  {
    id: 7,
    code: '11877',
    categoryId: categories[3].id,
    alias: 'futbolka-bazova-akvamaryn',
    title: 'Футболка базова аквамарин',
    description: 'Аквамарин однотонна базова футболка - річ, яка легко впишеться в будь-який гардероб. Коли потрібно щоб було комфортно та стильно - обирай базову футболку та доповнюй стильними джинсами, шортами або спідницею.',
    isActive: 1,
  },
  {
    id: 8,
    code: '11878',
    categoryId: categories[3].id,
    alias: 'futbolka-bazova-bezheva',
    title: 'Футболка базова бежева',
    description: 'Жовта однотонна базова футболка - річ, яка легко впишеться в будь-який гардероб. Коли потрібно щоб було комфортно та стильно - обирай базову футболку та доповнюй стильними джинсами, шортами або спідницею.',
    isActive: 1,
  }
];

export const similarProducts = [
  // обичні
  { productId: products[0].id, similarProductId: products[1].id },
  { productId: products[0].id, similarProductId: products[2].id },
  { productId: products[0].id, similarProductId: products[3].id },
  { productId: products[1].id, similarProductId: products[0].id },
  { productId: products[1].id, similarProductId: products[2].id },
  { productId: products[1].id, similarProductId: products[3].id },
  { productId: products[2].id, similarProductId: products[0].id },
  { productId: products[2].id, similarProductId: products[1].id },
  { productId: products[2].id, similarProductId: products[3].id },
  { productId: products[3].id, similarProductId: products[0].id },
  { productId: products[3].id, similarProductId: products[1].id },
  { productId: products[3].id, similarProductId: products[2].id },
  // худі на флісе
  { productId: products[4].id, similarProductId: products[5].id },
  { productId: products[5].id, similarProductId: products[4].id },
  // футболкі
  { productId: products[6].id, similarProductId: products[7].id },
  { productId: products[7].id, similarProductId: products[6].id },
];

export const productProperties = [
  { productId: products[0].id, propertyId: properties[4].id, propertyValueId: propertyValues[17].id },
  { productId: products[1].id, propertyId: properties[4].id, propertyValueId: propertyValues[18].id },
  { productId: products[2].id, propertyId: properties[4].id, propertyValueId: propertyValues[19].id },
  { productId: products[3].id, propertyId: properties[4].id, propertyValueId: propertyValues[20].id },
  { productId: products[4].id, propertyId: properties[4].id, propertyValueId: propertyValues[21].id },
  { productId: products[5].id, propertyId: properties[4].id, propertyValueId: propertyValues[20].id },
  { productId: products[6].id, propertyId: properties[4].id, propertyValueId: propertyValues[20].id },
  { productId: products[7].id, propertyId: properties[4].id, propertyValueId: propertyValues[15].id },

  { productId: products[0].id, propertyId: properties[3].id, propertyValueId: propertyValues[8].id },
  { productId: products[1].id, propertyId: properties[3].id, propertyValueId: propertyValues[8].id },
  { productId: products[2].id, propertyId: properties[3].id, propertyValueId: propertyValues[8].id },
  { productId: products[3].id, propertyId: properties[3].id, propertyValueId: propertyValues[8].id },
  { productId: products[4].id, propertyId: properties[3].id, propertyValueId: propertyValues[8].id },
  { productId: products[5].id, propertyId: properties[3].id, propertyValueId: propertyValues[8].id },
  { productId: products[6].id, propertyId: properties[3].id, propertyValueId: propertyValues[5].id },
  { productId: products[7].id, propertyId: properties[3].id, propertyValueId: propertyValues[5].id },

  { productId: products[0].id, propertyId: properties[2].id, propertyValueId: propertyValues[1].id },
  { productId: products[1].id, propertyId: properties[2].id, propertyValueId: propertyValues[1].id },
  { productId: products[2].id, propertyId: properties[2].id, propertyValueId: propertyValues[1].id },
  { productId: products[3].id, propertyId: properties[2].id, propertyValueId: propertyValues[1].id },
  { productId: products[4].id, propertyId: properties[2].id, propertyValueId: propertyValues[1].id },
  { productId: products[5].id, propertyId: properties[2].id, propertyValueId: propertyValues[1].id },
  { productId: products[6].id, propertyId: properties[2].id, propertyValueId: propertyValues[0].id },
  { productId: products[7].id, propertyId: properties[2].id, propertyValueId: propertyValues[0].id },

  { productId: products[0].id, propertyId: properties[1].id, propertyValueId: propertyValues[10].id },
  { productId: products[1].id, propertyId: properties[1].id, propertyValueId: propertyValues[10].id },
  { productId: products[2].id, propertyId: properties[1].id, propertyValueId: propertyValues[10].id },
  { productId: products[3].id, propertyId: properties[1].id, propertyValueId: propertyValues[10].id },
  { productId: products[4].id, propertyId: properties[1].id, propertyValueId: propertyValues[9].id },
  { productId: products[5].id, propertyId: properties[1].id, propertyValueId: propertyValues[9].id },
  { productId: products[6].id, propertyId: properties[1].id, propertyValueId: propertyValues[11].id },
  { productId: products[7].id, propertyId: properties[1].id, propertyValueId: propertyValues[11].id },

  { productId: products[0].id, propertyId: properties[0].id, propertyValueId: propertyValues[12].id },
  { productId: products[1].id, propertyId: properties[0].id, propertyValueId: propertyValues[12].id },
  { productId: products[2].id, propertyId: properties[0].id, propertyValueId: propertyValues[12].id },
  { productId: products[3].id, propertyId: properties[0].id, propertyValueId: propertyValues[12].id },
  { productId: products[4].id, propertyId: properties[0].id, propertyValueId: propertyValues[12].id },
  { productId: products[5].id, propertyId: properties[0].id, propertyValueId: propertyValues[12].id },
  { productId: products[6].id, propertyId: properties[0].id, propertyValueId: propertyValues[12].id },
  { productId: products[7].id, propertyId: properties[0].id, propertyValueId: propertyValues[12].id },
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
    postAddress: 'Lomonosova 50/2, отеделние 155',
    couponId: coupons[0].id,
    approved: 1,
    type: EOrderType.OPEN,
    paymentType: EOrderPaymentType.CASH,
    payment: EOrderPayment.UN_PAID
  },
  {
    id: 2,
    email: 'test@test.com',
    firstName: 'Jura 2',
    lastName: 'Zubach 2',
    phone: '10322',
    city: 'Kyiv',
    region: 'Kyiv region',
    postAddress: 'Lomonosova 50/2, отеделние 155',
    couponId: coupons[0].id,
    approved: 1,
    type: EOrderType.OPEN,
    paymentType: EOrderPaymentType.CASH,
    payment: EOrderPayment.UN_PAID
  },
  {
    id: 3,
    email: 'test@test.com',
    firstName: 'Jura 3',
    lastName: 'Zubach 3',
    phone: '103',
    city: 'Kyiv',
    region: 'Kyiv region',
    postAddress: 'Lomonosova 50/2, отеделние 155',
    couponId: coupons[1].id,
    approved: 1,
    type: EOrderType.OPEN,
    paymentType: EOrderPaymentType.CASH,
    payment: EOrderPayment.UN_PAID
  },
  {
    id: 4,
    email: 'test@test.com',
    firstName: 'Jura 3',
    lastName: 'Zubach 3',
    phone: '103',
    city: 'Kyiv',
    region: 'Kyiv region',
    postAddress: 'Lomonosova 50/2, отеделние 155',
    couponId: null,
    approved: 1,
    type: EOrderType.OPEN,
    paymentType: EOrderPaymentType.CASH,
    payment: EOrderPayment.UN_PAID
  },
  {
    id: 5,
    email: 'test@test.com',
    firstName: 'Jura 3',
    lastName: 'Zubach 3',
    phone: '103',
    city: 'Kyiv',
    region: 'Kyiv region',
    postAddress: 'Lomonosova 50/2, отеделние 155',
    couponId: null,
    approved: 1,
    type: EOrderType.OPEN,
    paymentType: EOrderPaymentType.CASH,
    payment: EOrderPayment.UN_PAID
  },
];
export const orderProducts = [
  {
    orderId: orders[0].id,
    productId: products[0].id,
    quantity: 5,
    price: 1000,
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
  { productId: products[0].id, quantity: 5, costPrice: 650, price: 1000, oldPrice: 1400, size: WAREHOUSE_PRODUCT_SIZE.S },
  { productId: products[0].id, quantity: 5, costPrice: 650, price: 1000, oldPrice: 1400, size: WAREHOUSE_PRODUCT_SIZE.M },
  { productId: products[1].id, quantity: 5, costPrice: 650, price: 1000, oldPrice: 1400, size: WAREHOUSE_PRODUCT_SIZE.S },
  { productId: products[1].id, quantity: 5, costPrice: 650, price: 1000, oldPrice: 1400, size: WAREHOUSE_PRODUCT_SIZE.M },
  { productId: products[2].id, quantity: 5, costPrice: 650, price: 1000, oldPrice: 1400, size: WAREHOUSE_PRODUCT_SIZE.S },
  { productId: products[2].id, quantity: 5, costPrice: 650, price: 1000, oldPrice: 1400, size: WAREHOUSE_PRODUCT_SIZE.M },
  { productId: products[3].id, quantity: 5, costPrice: 650, price: 1000, oldPrice: 1400, size: WAREHOUSE_PRODUCT_SIZE.S },
  { productId: products[3].id, quantity: 5, costPrice: 650, price: 1000, oldPrice: 1400, size: WAREHOUSE_PRODUCT_SIZE.M },
  { productId: products[3].id, quantity: 5, costPrice: 650, price: 1000, oldPrice: 1400, size: WAREHOUSE_PRODUCT_SIZE.L },
  { productId: products[4].id, quantity: 5, costPrice: 650, price: 1000, oldPrice: 1400, size: WAREHOUSE_PRODUCT_SIZE.S },
  { productId: products[4].id, quantity: 5, costPrice: 650, price: 1000, oldPrice: 1400, size: WAREHOUSE_PRODUCT_SIZE.M },
  { productId: products[4].id, quantity: 5, costPrice: 650, price: 1000, oldPrice: 1400, size: WAREHOUSE_PRODUCT_SIZE.L },
  { productId: products[5].id, quantity: 5, costPrice: 650, price: 1000, oldPrice: 1400, size: WAREHOUSE_PRODUCT_SIZE.S },
  { productId: products[5].id, quantity: 5, costPrice: 650, price: 1000, oldPrice: 1400, size: WAREHOUSE_PRODUCT_SIZE.M },
  { productId: products[5].id, quantity: 5, costPrice: 650, price: 1000, oldPrice: 1400, size: WAREHOUSE_PRODUCT_SIZE.L },
  { productId: products[6].id, quantity: 5, costPrice: 650, price: 800, oldPrice: 1200, size: WAREHOUSE_PRODUCT_SIZE.XS },
  { productId: products[6].id, quantity: 5, costPrice: 650, price: 800, oldPrice: 1200, size: WAREHOUSE_PRODUCT_SIZE.S },
  { productId: products[6].id, quantity: 5, costPrice: 650, price: 800, oldPrice: 1200, size: WAREHOUSE_PRODUCT_SIZE.M },
  { productId: products[7].id, quantity: 5, costPrice: 650, price: 800, oldPrice: 1200, size: WAREHOUSE_PRODUCT_SIZE.XS },
  { productId: products[7].id, quantity: 5, costPrice: 650, price: 800, oldPrice: 1200, size: WAREHOUSE_PRODUCT_SIZE.S },
  { productId: products[7].id, quantity: 5, costPrice: 650, price: 800, oldPrice: 1200, size: WAREHOUSE_PRODUCT_SIZE.M },
];

export const collections = [
  { id: 1, imageSrc: 'example.png', alias: 'nezaleshna', title: 'Незалежна', description: 'Описание незалежна', isActive: 1 },
  { id: 2, imageSrc: 'example.png', alias: 'tony-soprano', title: 'Тони сопрано', description: 'Описание сопрано', isActive: 1 },
  { id: 3, imageSrc: 'example.png', alias: 'summer', title: 'Прекрасное лето', description: 'Описание лето', isActive: 1 },
];

export const collectionProducts = [
  { collectionId: collections[0].id, productId: products[0].id },
  { collectionId: collections[0].id, productId: products[1].id },
  { collectionId: collections[0].id, productId: products[2].id },
  { collectionId: collections[0].id, productId: products[3].id },
  { collectionId: collections[1].id, productId: products[4].id },
  { collectionId: collections[1].id, productId: products[5].id },
];
