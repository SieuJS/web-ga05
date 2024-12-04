import { ApiProperty, OmitType } from "@nestjs/swagger";
import { OrderProductBill } from "@prisma/client";

export class OrderProductBillData {
    @ApiProperty({description : 'The id of the bill', example : '123213-123123-123123'})
    id : string;

    @ApiProperty({description : "The order id", example : "123213-123123-123123"})
    orderId : string;

    @ApiProperty({description : 'The product id', example : '123213-123123-123123'})
    productId : string;

    @ApiProperty({description : "The name of product", example : "Product 1"})
    productName : string;

    @ApiProperty({description : "The quantity of product", example : 1})
    quantity : number;

    @ApiProperty({description : "The price of product", example : 100})
    price : number;

    @ApiProperty({description : "The total price of product", example : 100})
    totalPrice : number;

    constructor (orderProductBill : OrderProductBill) {
        this.id = orderProductBill.id;
        this.orderId = orderProductBill.orderId;
        this.productId = orderProductBill.productId;
        this.productName = orderProductBill.productName;
        this.quantity = orderProductBill.quantity;
        this.price = orderProductBill.price;
        this.totalPrice = orderProductBill.totalPrice;
    }
}

export class OrderProductBillInput extends OmitType(OrderProductBillData, ['id']) {}