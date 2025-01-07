import { ProductData } from "./product.data";
import { ApiProperty, OmitType } from "@nestjs/swagger";

export class ProductInput extends OmitType(ProductData, ['id', 'categoryId'] as const) {

    @ApiProperty({description : "The images" , example : ["https://www.google.com"]})
    images? : string[] ;
}

