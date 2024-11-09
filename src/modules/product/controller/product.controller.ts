import { Body, Post,Get, Query, Controller } from "@nestjs/common";
import { ProductService } from "../service/product.service";
import { ProductData, ProductInput } from "../model";
import { PaginationArgs } from "nestjs-prisma-pagination";

interface ProductPaginateResponse {
    data: ProductData[];
    total: number;
    next : string;
    previous : string;
    limit : number;
} 

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    async createProduct(@Body() data: ProductInput): Promise<ProductData> {
        return this.productService.createProduct(data);
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

    @Get('detail')
    async getProductById(@Query('id') id: string): Promise<ProductData> {
        return this.productService.getProductById(parseInt(id));
    }
}