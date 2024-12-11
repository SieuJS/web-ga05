import { Injectable } from "@nestjs/common";
import { PaginationArgs, PaginationPrismaQuery } from "../model";

@Injectable()
export class PaginatePrismaService { 
    constructor() {
    }

    public getPaginateQuery (paginateArgs : PaginationArgs) : PaginationPrismaQuery  {
        const { page, perPage } = paginateArgs;
        const take = perPage;
        const skip = (page - 1) * perPage;
        return { take, skip };
    }

    public getPaginateMeta (total : number, paginateArgs : PaginationArgs) {
        const { page, perPage } = paginateArgs;
        const totalPage = Math.ceil(total / perPage);
        const next = page < totalPage ? `${page + 1}` : null;
        const previous = page > 1 ? `${page - 1}` : null;
        return { total, next, previous, perPage };
    }
}