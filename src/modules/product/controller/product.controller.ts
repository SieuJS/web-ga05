import { Body, Post,Get, Query, Controller, Param, HttpException, HttpStatus, Patch, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { PaginateTransformPipe } from "../../paginate";
import { ProductService } from "../service/product.service";
import { PaginatedProductReview, ProductData, ProductInput } from "../model";
import { ApiTags } from "@nestjs/swagger";
import { LoggerService } from "../../common";
import { SearchProductPipe } from "../pipe/search-product.pipe";
import { ProductPaginatedResult } from "../model";
import { PaginationArgs } from "../../paginate";
import { SortOrderProductPipe } from "../pipe/sort-order-product.pipe";
import { CategoryService } from "../../category/service";
import { TranformProductPipe } from "../pipe/tranform-product.pipe";
import { CategoryInput } from "../../category/model";
import { ProductReviewService } from "../service/product-review.service";
import { CacheInterceptor } from "@nestjs/cache-manager";

@Controller('product')
@ApiTags("Product")
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly loggerService : LoggerService,
        private readonly categoryService : CategoryService,
        private readonly productReviewService : ProductReviewService

    ) {}

    @Post()
    async createProduct(@Body() data: ProductInput): Promise<ProductData> {
        const product = await this.productService.createProduct(data);
        this.loggerService.info(`Created new Product with ID ${product.id}`);
        return product
    }
    @UseInterceptors(CacheInterceptor)
    @Get()
    @ApiOperation({ summary: 'Get all product' })
    @ApiQuery({ name: 'search', required: false})
    @ApiQuery({ name: 'season', required: false})
    @ApiQuery({ name: 'color', required: false})
    @ApiQuery({name : 'master', required : false})
    @ApiQuery({name : 'orderBy', required : false})
    @ApiQuery({name : "order", required : false})
    @ApiResponse({ status: 200, description: 'Get all product' , type : ProductPaginatedResult})
    async getListProduct(@Query(PaginateTransformPipe) paginationArgs: PaginationArgs , @Query(SearchProductPipe) searchProduct : any, @Query(SortOrderProductPipe) orderBy : any ): Promise<ProductPaginatedResult> {
        const products = await this.productService.getListProduct(searchProduct, paginationArgs, orderBy);
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

    @Post('upload')
    @ApiOperation({ summary: 'Upload product image' })
    @ApiResponse({ status: 200, description: 'Upload product image' })
    async uploadProduct( @Body() cateInfo : any, @Body(TranformProductPipe) productInput : ProductInput) {
        const category = await this.categoryService.getUniqueCategory(cateInfo);
        if(!category) {
            return new HttpException("Category not found", HttpStatus.NOT_FOUND);
        }
        let createdProduct ;
        let imageLinks;
        try {
            createdProduct = await this.productService.createProductWithCategory({
                ...productInput,
            },  category.id);
        }
        catch(err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {
            product : createdProduct,
            images : imageLinks
        }
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'Update product' })
    async updateProduct(@Param('id') id: string,@Body(TranformProductPipe) data: ProductInput, @Body() cateInfo : CategoryInput): Promise<ProductData> {
        const category = await this.categoryService.getUniqueCategory(cateInfo);
        if(!category) {
            throw new HttpException("Category not found", HttpStatus.NOT_FOUND);
        }
        return this.productService.updateProduct(id, data, category.id);
    }


    @Get(
        'admin/:id'
    )
    @ApiOperation({ summary: 'get by id for admin' })
    async getProduct(@Param('id') id: string): Promise<ProductData> {
        return this.productService.getUniqueProductAdmin(id);
    }

    @Get('/review/:productId') 
    @ApiOperation({ summary: 'Get all review of product' })
    @ApiParam({name : 'productId'})
    @ApiResponse({ status: 200, description: 'Get all review of product' , type : PaginatedProductReview})
    async getReviewProduct(@Param('productId') productId: string, @Query(PaginateTransformPipe) paginationArgs: PaginationArgs): Promise<PaginatedProductReview> {
        return this.productReviewService.getReviewByProductId(productId, paginationArgs);
    }
}