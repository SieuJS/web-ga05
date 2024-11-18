import { Body, Post,Get, Query, Controller, Param } from "@nestjs/common";
import { ProductService } from "../service/product.service";
import { ProductData, ProductInput } from "../model";
import { PaginationArgs } from "nestjs-prisma-pagination";
import { ApiTags } from "@nestjs/swagger";
import { LoggerService } from "../../common";

interface ProductPaginateResponse {
    data: ProductData[];
    total: number;
    next : string;
    previous : string;
    limit : number;
} 

@Controller('product')
@ApiTags("Product")
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly loggerService : LoggerService
        
    ) {}

    @Post()
    async createProduct(@Body() data: ProductInput): Promise<ProductData> {
        const product = await this.productService.createProduct(data);
        this.loggerService.info(`Created new Product with ID ${product.id}`);
        return product
    }

    @Get()
    async getListProduct(@Query() paginationArgs: PaginationArgs = {}): Promise<ProductPaginateResponse> {
        const products = await this.productService.getListProduct(paginationArgs);
        return {
            data: products,
            total: products.length,
            next: '',
            previous: '',
            limit: products.length
        }
    }

    @Get('detail/:id')
    async getProductById(@Param('id') id: string): Promise<ProductData> {
        return this.productService.getProductById(id);
    }
}