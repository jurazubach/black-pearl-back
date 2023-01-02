import { EntityManager, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _capitalize from 'lodash/capitalize';
import _first from 'lodash/first';
import { IPagination } from '../../decorators/pagination.decorators';
import { CustomerEntity } from '../../entity/customer.entity';
import { ORDER_PAYMENT, ORDER_TYPE, OrderEntity } from '../../entity/order.entity';
import { OrderProductEntity } from '../../entity/orderProduct.entity';
import { ProductEntity } from '../../entity/product.entity';
import { OrderProductPropertyEntity } from '../../entity/orderProductProperty.entity';
import { PropertyEntity } from '../../entity/property.entity';
import { PropertyValueEntity } from '../../entity/propertyValue.entity';
import { I18nService } from 'nestjs-i18n';
import { formatProductProperties, IProductProperty } from '../product/product.helper';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { ProductService } from '../product/product.service';
import { CouponEntity } from '../../entity/coupon.entity';
import { WarehouseService } from '../warehouse/warehouse.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    @InjectRepository(CouponEntity)
    private readonly couponRepository: Repository<CouponEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderProductEntity)
    private readonly orderProductRepository: Repository<OrderProductEntity>,
    @InjectRepository(OrderProductPropertyEntity)
    private readonly orderProductPropertyRepository: Repository<OrderProductPropertyEntity>,
    private readonly i18n: I18nService,
    private readonly productService: ProductService,
    private readonly warehouseService: WarehouseService,
    private readonly entityManager: EntityManager,
  ) {
  }

  async getOrderByParams(where: { [key: string]: any }, lang: string) {
    const order = await this.orderRepository
      .createQueryBuilder('o')
      .select(`
        o.*,
        IF(c.id IS NOT NULL, JSON_OBJECT(
          'id', c.id,
          'type', c.type,
          'code', c.code,
          'percent', c.percent,
          'price', c.price,
          'createdAt', c.createdAt,
          'endAt', c.endAt
        ), NULL) as coupon
      `)
      .leftJoin('coupons', 'c', 'c.id = o.couponId')
      .where(where)
      .getRawOne<OrderEntity>();

    if (!order) throw new HttpException('Order not found', HttpStatus.NOT_FOUND);

    const orders = await this.getOrderProducts([order], lang)

    return _first(orders);
  }

  async getOrderList(pagination: IPagination, lang: string): Promise<object[]> {
    const ordersWithCoupons = await this.orderRepository
      .createQueryBuilder('o')
      .select(`
        o.*,
        IF(c.id IS NOT NULL, JSON_OBJECT(
          'id', c.id,
          'type', c.type,
          'code', c.code,
          'percent', c.percent,
          'price', c.price,
          'createdAt', c.createdAt,
          'endAt', c.endAt
        ), NULL) as coupon
      `)
      .leftJoin('coupons', 'c', 'c.id = o.couponId')
      .limit(pagination.limit)
      .offset(pagination.offset)
      .getRawMany<OrderEntity>();

    return this.getOrderProducts(ordersWithCoupons, lang);
  }

  async getOrderProducts(orderEntities: OrderEntity[], lang: string) {
    const orders: any[] = [];

    const orderProducts = await Promise.all(
      orderEntities.map(({ id }) => {
        return this.orderProductRepository
          .createQueryBuilder('op')
          .select(
            `op.id as orderProductId,
            op.price,
            op.quantity,
            JSON_OBJECT(
              'id', p.id,
              'alias', p.alias,
              'singleTitle', p.singleTitle${_capitalize(lang)},
              'multipleTitle', p.multipleTitle${_capitalize(lang)}
            ) as product
            `)
          .innerJoin(OrderEntity, 'o', 'o.id = op.orderId')
          .innerJoin(ProductEntity, 'p', 'p.id = op.productId')
          .where('op.orderId = :orderId', { orderId: id })
          .getRawMany<OrderProductEntity>()
          .then(async (orderProducts) => {
            for await (const product of orderProducts) {
              const images = await this.productService.getProductImages(product.product.alias);
              Object.assign(product.product, { images });
            }

            return { orderId: id, products: orderProducts };
          });
      }),
    );

    const orderProductPromises: Promise<any>[] = [];
    orderProducts.forEach(({ products }) => {
      return products.forEach(({ orderProductId }) => {
        orderProductPromises.push(
          this.orderProductPropertyRepository
            .createQueryBuilder('opp')
            .select(`
            property.id as propertyId,
            property.alias as propertyAlias,
            propertyValue.id as propertyValueId,
            propertyValue.alias as propertyValueAlias
            `)
            .innerJoin(PropertyEntity, 'property', 'property.id = opp.propertyId')
            .innerJoin(PropertyValueEntity, 'propertyValue', 'propertyValue.id = opp.propertyValueId AND propertyValue.propertyId = property.id')
            .where('opp.orderProductId = :orderProductId', { orderProductId })
            .getRawMany<IProductProperty>()
            .then(async (productProperties) => {
              const properties = await formatProductProperties(lang, this.i18n, productProperties);
              return { orderProductId, properties };
            }),
        );
      });
    });

    const orderProductProperties = await Promise.all(orderProductPromises);

    const orderProductsWithProperties = orderProducts.map((orderProduct) => {
      return {
        orderId: orderProduct.orderId,
        products: orderProduct.products.map((product) => {
          let matchProperties = orderProductProperties.find((i) => i.orderProductId);

          return { ...product, properties: matchProperties ? matchProperties.properties : [] };
        }),
      };
    });

    orderEntities.forEach((order) => {
      const matchProducts = orderProductsWithProperties.find((i) => i.orderId === order.id);

      orders.push({
        ...order,
        orderProducts: matchProducts ? matchProducts.products : [],
      });
    });

    return orders;
  }

  async getCouponByParams(where: { [key: string]: any }): Promise<CouponEntity> {
    const coupon = await this.couponRepository
      .createQueryBuilder('c')
      .where(where)
      .select('*')
      .getRawOne<CouponEntity>();

    if (!coupon) throw new HttpException('Coupon not found', HttpStatus.BAD_REQUEST);

    return coupon;
  }

  async createOrder(payload: CreateOrderDto, lang: string) {
    let coupon: CouponEntity | null = null;

    if (payload.couponCode) {
      coupon = await this.getCouponByParams({ code: payload.couponCode })
    }

    const orderEntity = new OrderEntity();
    Object.assign(orderEntity, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      city: payload.city,
      region: payload.region,
      address: payload.address,
      flat: payload.flat,
      phone: payload.phone,
      approved: payload.approved || 0,
      couponId: coupon ? coupon.id : null,
      type: ORDER_TYPE.OPEN,
      payment: ORDER_PAYMENT.UN_PAID,
    })

    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.startTransaction();

      const order = await this.orderRepository.save(orderEntity, { transaction: false });

      for await (const payloadOrderProduct of payload.orderProducts) {
        const product = await this.productService.getPureProduct({ id: payloadOrderProduct.productId });
        const availableQuantity = await this.warehouseService.calculateAvailableProductQuantity(
          payloadOrderProduct.productId,
          payloadOrderProduct.productProperties,
        );

        if (availableQuantity < payloadOrderProduct.quantity) {
          throw new HttpException(
            `Product [ID:${payloadOrderProduct.productId}] quantity is ${availableQuantity} and this is less than: ${payloadOrderProduct.quantity}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const orderProductEntity = new OrderProductEntity();
        Object.assign(orderProductEntity, {
          orderId: order.id,
          productId: product.id,
          quantity: payloadOrderProduct.quantity,
          price: payloadOrderProduct.price,
        })
        await this.warehouseService.decreaseProductQuantity(
          payloadOrderProduct.productId,
          payloadOrderProduct.productProperties,
          payloadOrderProduct.quantity,
        );
        const orderProduct = await this.orderProductRepository.save(orderProductEntity, { transaction: false });

        for await (const payloadOrderProductProperty of payloadOrderProduct.productProperties) {
          const orderProductPropertyEntity = new OrderProductPropertyEntity();
          Object.assign(orderProductPropertyEntity, {
            orderProductId: orderProduct.id,
            propertyId: payloadOrderProductProperty.propertyId,
            propertyValueId: payloadOrderProductProperty.propertyValueId,
          });

          await this.orderProductPropertyRepository.save(orderProductPropertyEntity, { transaction: false });
        }
      }

      await queryRunner.commitTransaction();

      return this.getOrderByParams({ id: order.id }, lang);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrder(id: number, payload: UpdateOrderDto) {
    const order = await this.orderRepository
      .createQueryBuilder('o')
      .select(`o.*`)
      .where('o.id = :id', { id })
      .getRawOne<OrderEntity>();

    if (!order) throw new HttpException('Order not found', HttpStatus.NOT_FOUND);

    Object.assign(order, payload);

    await this.orderRepository
      .createQueryBuilder()
      .update(order)
      .where('id = :id', { id })
      .execute();
  }
}
