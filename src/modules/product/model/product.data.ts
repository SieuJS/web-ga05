import { ApiProperty } from "@nestjs/swagger";
import { Product } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class ProductData {
    @ApiProperty({description: 'The id of the product', example: 'd1234231-1231-1231-1231-123123123123'})
    id : string ;

    @ApiProperty({description: 'The name of the product', example: 'CLocker'})
    name : string | null ;

    @ApiProperty({description : "The gender suitable for the product", example : "male"})
    gender: string | null ; 

    @ApiProperty ({description : "THe id of category " , example : "d1234231-1231-1231-1231-123123123123"})
    categoryId? : string | null;

    @ApiProperty ({description : "The price of the product", example : 1000})
    price? : Decimal | null;

    @ApiProperty ({description : "The description of the product", example : "This is a locker"})
    description? : string | null;

    @ApiProperty ({description : "base color of the product", example : "red"})
    baseColour? : string | null ; 

    @ApiProperty({description : "The image of the product", example : "https://www.google.com"})
    image? : string | null;

    @ApiProperty({description : "The article of product", example : "Shirts"})
    articleType? : string | null;

    @ApiProperty({description : "season of the product", example : "summer"})
    season? : string | null;

    @ApiProperty({description : "year of the product", example : "2021"})
    year? : string | null;

    @ApiProperty({description : "usage of the product", example : "casual"})
    usage? : string | null;

    @ApiProperty({description : "The quantity of product", example : 10})
    quantity : number;

    @ApiProperty({description : "The status of product", example : "instock"})
    status : string ;




    constructor(product: Product) {
        this.id = product.id;
        this.name = product.name as string;
        this.gender = product.gender as string;
        this.categoryId = product.categoryId as string;
        this.price = product.price as Decimal;
        this.description = product.description as string;
        this.baseColour = product.baseColour as string;
        this.image = product.image as string;
        this.articleType = product.articleType as string;
        this.season = product.season as string;
        this.year = product.year as string;
        this.usage = product.usage as string;
        this.quantity = product.quantity as number;

    }
}