import { ApiProperty } from "@nestjs/swagger";
import { PaginatorTypes } from "@nodeteam/nestjs-prisma-pagination";


export class PaginationMeta  {

    @ApiProperty({description : "The total of data", example : 100})
    total : number;
    @ApiProperty({description : "The last page of data", example : 10})
    lastPage : number;
    @ApiProperty({description : "The current page of data", example : 1})
    currentPage : number;
    @ApiProperty({description : "The per page of data", example : 10})
    perPage : number;
    @ApiProperty({description : "The previous page of data", example : 1})
    prev : number | null;
    @ApiProperty({description : "The next page of data", example : 2})
    next : number | null;

    constructor (meta : PaginatorTypes.PaginatedResult<any>) {
        this.total = meta.meta.total;
        this.lastPage = meta.meta.lastPage;
        this.currentPage = meta.meta.currentPage;
        this.perPage = meta.meta.perPage;
        this.prev = meta.meta.prev;
        this.next = meta.meta.next;
    }
}

export class PaginationArgs  { 
    @ApiProperty({description : "The page of data", type : Number, example : 1})
    page : number ;
    @ApiProperty({description : "The limit of data" , type : Number, example : 10})
    perPage : number ;

    constructor (args : PaginatorTypes.PaginateOptions) {
        this.page = args.page as number;
        this.perPage = args.perPage as number;
    }
}

export class PaginationPrismaQuery { 
    @ApiProperty({description : "The take of data"})
    take : number;
    @ApiProperty({description : "The skip of data"})
    skip : number;
}