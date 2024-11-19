import { Body, Post,Get, Query, Controller, Param } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { ProductService } from "../service/product.service";
import { ProductData, ProductInput } from "../model";
import { PaginationArgs } from "nestjs-prisma-pagination";
import { ApiTags } from "@nestjs/swagger";
import { LoggerService } from "../../common";
import { SearchProductPipe } from "../pipe/search-product.pipe";


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
    @ApiOperation({ summary: 'Get all product' })
    @ApiResponse({ status: 200, description: 'Get all product' , type : ProductData})
    async getListProduct(@Query() paginationArgs: PaginationArgs = {} , @Query(SearchProductPipe) searchProduct : any ): Promise<ProductPaginateResponse> {
        console.log(searchProduct)

        const products = await this.productService.getListProduct(searchProduct, paginationArgs);
        return {
            data: products,
            total: products.length,
            next: '',
            previous: '',
            limit: products.length
        }
    }

    @Get('detail/:id')
    @ApiOperation({ summary: 'Get product by ID' })
    async getProductById(@Param('id') id: string): Promise<ProductData> {
        return this.productService.getProductById(id);
    }

    @Get('related/:id')
    @ApiOperation({ summary: 'Get related product by ID' })
    @ApiResponse({ status: 200, description: 'Get related product by ID' , isArray : true, type : ProductData})
    async getRelatedProduct(@Param('id') id: string): Promise<ProductData[]> {
        return this.productService.getRelatedProduct(id);
    }
}