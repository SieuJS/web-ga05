import { Injectable } from "@nestjs/common";
import { CategoryData, CategoryInput } from "../model";
import { PrismaService } from "../../common";

@Injectable() 
export class CategoryService {
    constructor (private prisma: PrismaService) {}

    async createCategory(data: CategoryInput): Promise<CategoryData> {
        const category = await this.prisma.category.create({
            data
        });
        return category as CategoryData;
    }

    async getListCategory(masterCate : string | null , subCategory : string | null): Promise<CategoryData[]> {
        const categories = await this.prisma.category.findMany({
            where : {
                masterCategory : masterCate,
                subCategory : subCategory
            }
        });
        return categories as CategoryData[];
    }

    async getListMasterCategory(): Promise<CategoryData[]> {
        const categories = await this.prisma.category.findMany({
            select : {
                masterCategory : true,
            },
            distinct : ['masterCategory']
        }) 
        return categories as CategoryData[];
    }

    async getListSubCategory(masterCategory: string): Promise<CategoryData[]> {
        const categories = await this.prisma.category.findMany({
            where : {
                masterCategory
            },
            distinct : ['subCategory']
        })
        return categories as CategoryData[];
    }
}