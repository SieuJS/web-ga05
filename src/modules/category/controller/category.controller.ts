import { Controller, Get, Query } from "@nestjs/common";
import { CategoryService } from "../service";
import { CategoryData} from "../model";
import { ApiQuery, ApiTags } from "@nestjs/swagger";

@Controller('category')
@ApiTags('Category')
export class CategoryController {
    constructor (private categoryService: CategoryService) {}

    @Get()
    async getListCategory() : Promise<CategoryData[]> {
        return this.categoryService.getAllCategory();
    }

    @Get('/master')
    async getListMasterCategory() : Promise<CategoryData[]> {
        return this.categoryService.getListMasterCategory();
    }

    @Get('/sub') 
    @ApiQuery({name : 'master', required : false})
    async getListSubCategory(@Query('master') master? : string) : Promise<CategoryData[]> {
        return this.categoryService.getListSubCategory(master || "");
    }
}