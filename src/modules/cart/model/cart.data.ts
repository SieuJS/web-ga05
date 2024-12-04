import { ApiProperty } from "@nestjs/swagger";
import { Cart } from "@prisma/client";

export class CartData {
    @ApiProperty({description: 'The id of the cart', example: 'd1234231-1231-1231-1231-123123123123'})
    id : string ;

    @ApiProperty({description: 'The id of the user', example: 'd1234231-1231-1231-1231-123123123123'})
    userId : string ;

    @ApiProperty({description: 'The id of the product', example: 'd1234231-1231-1231-1231-123123123123'})
    productId : string | null;

    @ApiProperty({description: 'The quantity of the product', example: 10})
    quantity : number ;

    constructor (cart : Cart) {
        this.id = cart.id;
        this.userId = cart.userId;
        this.productId = cart.productId ;
        this.quantity = cart.quantity;
    }

}