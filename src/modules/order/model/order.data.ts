import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Order } from "@prisma/client";


export class OrderData {
    @ApiProperty({description : 'The id of the order', example : '123213-123123-123123'})
    id : string;

    @ApiProperty({description : 'The user id', example : '123213-123123-123123'})
    userId : string;

    @ApiProperty({description : 'The total price of the order', example : 100})
    totalPrice : number;

    @ApiProperty({description : 'The status of the order', example : 'pending'})
    status : string;

    @ApiProperty({description : 'The date of the order', example : '2021-12-12'})
    orderDate : Date;

    constructor (orderData : Order) {
        this.id = orderData.id;
        this.userId = orderData.userId;
        this.totalPrice = orderData.totalPrice;
        this.status = orderData.status;
        this.orderDate = orderData.orderDate;
    }
}

export class OrderInput extends OmitType(OrderData, ['id', 'orderDate']) {}