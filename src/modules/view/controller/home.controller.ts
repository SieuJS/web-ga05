import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { ProductService } from "../../product";
import { PaginateTransformPipe } from "../../common";
import { PaginationArgs } from "../../paginate";
import { SearchProductPipe } from "../../product/pipe/search-product.pipe";
import { CategoryService } from "../../category/service";
import { CategoryRenderInput } from "../model/category-render-input";

@Controller( "view"  )
export class HomeController {
    constructor(
        private readonly productService: ProductService,
        private readonly categoryService: CategoryService
    ) {}
    @Get('/')
    async root(@Res() res: Response) {
        const products = await this.productService.getNewArrivalProduct();
        return res.render('home', { products });
    }

    @Get('/shop')
    async shop(@Res() res: Response, @Query(PaginateTransformPipe) paginationArgs: PaginationArgs, @Query(SearchProductPipe) searchProduct: any) {
        const result = await this.productService.getListProduct(searchProduct, paginationArgs);

        const masterCategories = await this.categoryService.getListMasterCategory();

        const categories = await this.categoryService.getAllCategory();

        const categoryInput : CategoryRenderInput = {
            masterCategory : masterCategories.map( item => item.masterCategory),
            categories
        }
        
        const products = result.data;
        return res.render('shop', { products , categoryInput });
    }
}
