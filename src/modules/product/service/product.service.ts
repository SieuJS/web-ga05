import { ProductData, ProductInput } from "../model";
import { PrismaService } from "../../common";
import { Injectable } from "@nestjs/common";
import { paginate, PaginationArgs, PaginationOptions } from 'nestjs-prisma-pagination';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}
    async createProduct(data: ProductInput): Promise<ProductData> {
        const product = await this.prisma.product.create({
            data
        });
        return product;
    }

    async getListProduct(paginationArgs : PaginationArgs = {}, paginationOptions : PaginationOptions = {}): Promise<ProductData[]> {
        const query = paginate({limit: 10, ...paginationArgs}, {orderBy : {id : 'asc'}, ...paginationOptions});
        const products = await this.prisma.product.findMany(query );
        return products;
    }

    async getProductById(id: number): Promise<ProductData> {
        const product = await this.prisma.product.findUnique({
            where: { id }
        });
        return product as ProductData;
    }
}