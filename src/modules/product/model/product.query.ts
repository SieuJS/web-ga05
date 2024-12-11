import { ApiProperty } from "@nestjs/swagger";
import { ProductData } from "./product.data";
import { PaginationMeta } from "../../paginate";


export class ProductPaginatedResult {
    @ApiProperty({description : "The data of product", type : ProductData, isArray : true})
    data: ProductData[];

    @ApiProperty({description : "The meta of pagination", type: PaginationMeta})
    meta : PaginationMeta;
}