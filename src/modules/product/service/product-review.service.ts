import {  Injectable } from "@nestjs/common";
import { PrismaService } from "../../common";

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
}