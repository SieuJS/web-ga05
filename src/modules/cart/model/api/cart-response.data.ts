import { ApiProperty } from "@nestjs/swagger";
import { CartWithProductData } from "../related";


export class CartResponseData  {
    @ApiProperty({description : "The message", example : "Cart has been updated"})
    message : string;

    @ApiProperty({description : "The cart data" , isArray : true , type : CartWithProductData, nullable : true})
    data : CartWithProductData[] | null;
}