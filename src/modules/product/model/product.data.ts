import { ApiProperty } from "@nestjs/swagger";
import { Product } from "@prisma/client";



export class ProductData {
    @ApiProperty({description: 'The id of the product', example: '1'})
    id : number ;

    @ApiProperty({description : "The id of the product", example : "10003"})
    productID : string;

    @ApiProperty({description: 'The name of the product', example: 'Product 1'})
    productName : string ;

    @ApiProperty({description: 'The description of the product', example: 'This is a product'})
    description : string ;

    @ApiProperty({description: 'The price of the product', example: 200})
    price : number ;

    @ApiProperty({description : "The brand of the product", example: "Brand 1"})
    productBrand : string;

    @ApiProperty({description : "Gender of the product", example: "male"})
    gender : string;

    @ApiProperty({description : "Number of image" , example : 1})
    numImages : number;

    @ApiProperty({description : "Primary color", example : "red"})
    primaryColor : string;

    @ApiProperty({description: "Image url", example: "http://localhost:3000/image.jpg"})
    image : string;

    constructor(product: Product) {
        this.id = product.id;
        this.productID = product.productID;
        this.productName = product.productName;
        this.description = product.description;
        this.price = product.price;
        this.productBrand = product.productBrand;
        this.numImages = product.numImages;
        this.primaryColor = product.primaryColor;
        this.image = product.image
    }
}