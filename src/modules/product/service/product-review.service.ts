import {  Injectable } from "@nestjs/common";
import { PrismaService } from "../../common";
import { PaginatorTypes, paginator } from "@nodeteam/nestjs-prisma-pagination";
import { PaginationArgs } from "../../paginate";
import { PaginatedProductReview } from "../model";
@Injectable()
export class ProductReviewService  {
    constructor(
        private readonly prismaService : PrismaService
    ){}

    async createReview(data : any){
        return this.prismaService.productReview.create({
            data
        })
    }

    async getReviewByProductId(productId : string, paginationArgs : PaginationArgs) : Promise<PaginatedProductReview>{
        const paginate: PaginatorTypes.PaginateFunction = paginator({perPage : 3, page : 1});  
        let reviews : PaginatedProductReview;
        reviews = await paginate(this.prismaService.productReview, {
            where : {
                productId
            },
            include : {
                user : true
            }
        }, paginationArgs);

        return reviews;
    }
}