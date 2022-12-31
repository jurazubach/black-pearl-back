import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

// product alias = hoodie_first
// [Product]

// [
// { это значит что для такого размера и для такого цвета, есть запись с такой-то ценой и кол-вом
//    /product/hoodie_first/5 - это значит что в данный момент на фронте предвыбранно цвет black и размер M
//    warehouseId: 5,
//    amount: 4,
//    price: 1200,
//    properties: [
//      { key: 'color', value: 'black' },
//      { key: 'size', value: 'M' },
//    ]
// }
// {
//    warehouseId: 6,
//    amount: 2,
//    price: 1200,
// }
// {
//    warehouseId: 2,
//    amount: 0,
//    price: 1200,
// }

//    {
//      property: 'color'
//      propertyValue: 'black
//    }
// ]

@Entity({ name: "warehouse_product_properties" })
export class WarehouseProductPropertyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  warehouseProductId: number;

  @Column({ type: "int", nullable: false })
  propertyId: number;

  @Column({ type: "int", nullable: false })
  propertyValueId: number;
}
