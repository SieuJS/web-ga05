import { Body, Post,Get, Query, Controller, Param } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { PaginateTransformPipe } from "../../paginate";
import { ProductService } from "../service/product.service";
import { ProductData, ProductInput } from "../model";
import { ApiTags } from "@nestjs/swagger";
import { LoggerService } from "../../common";
import { SearchProductPipe } from "../pipe/search-product.pipe";
import { ProductPaginatedResult } from "../model";
import { PaginationArgs } from "../../paginate";


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
    @ApiQuery({ name: 'search', required: false})
    @ApiResponse({ status: 200, description: 'Get all product' , type : ProductPaginatedResult})
    async getListProduct(@Query(PaginateTransformPipe) paginationArgs: PaginationArgs , @Query(SearchProductPipe) searchProduct : any ): Promise<ProductPaginatedResult> {
        const products = await this.productService.getListProduct(searchProduct, paginationArgs);
        return products;
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

    @Get('new-arrivals') 
    @ApiOperation({ summary: 'Get new arrival product' })
    @ApiResponse({ status: 200, description: 'Get new arrival product' , isArray : true, type : ProductData})
    async getNewArrivalProduct() {
        return this.productService.getNewArrivalProduct();
    }
}