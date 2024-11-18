import { Category } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CategoryData {
    @ApiProperty({description: 'The id of the category', example: 'd1234231-1231-1231-1231-123123123123'})
    id : string ;

    @ApiProperty({description: 'The name of the  master category', example: 'Clothing'})
    masterCategory : string ;

    @ApiProperty({description : "The name of the subcategory", example : "Tshirt"})
    subCategory : string;

    constructor(category: Category) {
        this.id = category.id;
        this.masterCategory = category.masterCategory as string;
        this.subCategory = category.subCategory as string;
    }
}