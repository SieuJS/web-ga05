import { ProductData } from "./product.data";
import { ApiProperty } from "@nestjs/swagger";
import { PaginatorTypes} from "@nodeteam/nestjs-prisma-pagination";
import { PaginationMeta } from "../../paginate";


export class PaginatedProduct implements PaginatorTypes.PaginatedResult<ProductData> {
    @ApiProperty({description : "The data of product", type : ProductData, isArray : true})
    data: ProductData[];

    @ApiProperty({description : "The meta of pagination", type: PaginationMeta})
    meta : PaginationMeta;
}