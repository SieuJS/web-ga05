import { Body, Post,Get, Query, Controller, Param, UploadedFiles, UseInterceptors, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { PaginateTransformPipe } from "../../paginate";
import { ProductService } from "../service/product.service";
import { ProductData, ProductInput } from "../model";
import { ApiTags } from "@nestjs/swagger";
import { Config, LoggerService } from "../../common";
import { SearchProductPipe } from "../pipe/search-product.pipe";
import { ProductPaginatedResult } from "../model";
import { PaginationArgs } from "../../paginate";
import { SortOrderProductPipe } from "../pipe/sort-order-product.pipe";
import {  FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { CategoryService } from "../../category/service";
import { Service } from "../../tokens";
import { TranformProductPipe } from "../pipe/tranform-product.pipe";

const storage = diskStorage({
  destination: './client/public/img/uploads',
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = extname(file.originalname);
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    cb(null, `${name}-${randomName}${extension}`);
  },
});

@Controller('product')
@ApiTags("Product")
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly loggerService : LoggerService,
        private readonly categoryService : CategoryService,
        @Inject(Service.CONFIG) 
        private readonly configService : Config,
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
    @UseInterceptors(FilesInterceptor('images[]', 10, {
        storage : storage,
    }))
    async uploadProductImage(@UploadedFiles() files: Array<Express.Multer.File>, @Body() cateInfo : any, @Body(TranformProductPipe) productInput : ProductInput) {
        const category = await this.categoryService.getUniqueCategory(cateInfo);
        if(!category) {
            return new HttpException("Category not found", HttpStatus.NOT_FOUND);
        }
        let createdProduct ;
        let imageLinks;
        try {
            imageLinks=  files.map(file => file.path.replace(`client`, this.configService.HOST_URL));

            createdProduct = await this.productService.createProductWithCategory({
                ...productInput,
                images : imageLinks
            },  category.id);
        }
        catch(err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {
            link : files.map(file => file.path.replace('client/public', '')),
            product : createdProduct,
            images : imageLinks
        }
    }

}