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
        return product as ProductData;
    }

    async getListProduct(paginationArgs : PaginationArgs = {}, paginationOptions : PaginationOptions = {}): Promise<ProductData[]> {
        const query = paginate({limit: 10, ...paginationArgs}, {orderBy : {id : 'asc'}, ...paginationOptions});
        const products = await this.prisma.product.findMany(query );
        return products as ProductData[];
    }

    async getProductById(id: string): Promise<ProductData> {
        const product = await this.prisma.product.findUnique({
            where: { id }
        });
        return product as ProductData;
    }

    async getAllColour(): Promise<string[]> {
        const colours = await this.prisma.product.findMany({
            distinct: ['baseColour'],
            select: {
                baseColour: true
            }
        });
        return colours.map(colour => colour.baseColour) as string[];
    }

    async getListColour(limit: number = 10): Promise<string[]> {

        const colourCounts = await this.prisma.product.groupBy({
            by : ['baseColour'],
            _count : {
                _all : true
            },
            orderBy : {
                baseColour : 'asc'
            },
            take : parseInt(limit.toString())
        });
        return colourCounts.map(colour => `${colour.baseColour}: ${colour._count._all}`) as string[];
    }
}