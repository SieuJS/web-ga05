import { Controller, Get, Param, Query, Res,  } from "@nestjs/common";
import { Response } from "express";
import { ProductService } from "../../product";
import { PaginateTransformPipe } from "../../common";
import { PaginationArgs } from "../../paginate";
import { SearchProductPipe } from "../../product/pipe/search-product.pipe";


@Controller( "/")
export class HomeController {
    constructor(
        private readonly productService: ProductService,

    ) {}
    @Get('/home')
    async root(@Res() res: Response) {
        const products = await this.productService.getNewArrivalProduct();
        return res.render('pages/public/home', { products });
    }

    @Get('/shop')
    async shop(@Res() res: Response, @Query(PaginateTransformPipe) paginationArgs: PaginationArgs, @Query(SearchProductPipe) searchProduct: any) {
        const result = await this.productService.getListProduct(searchProduct, paginationArgs );
        
        const products = result.data;
        const meta = result.meta;
        return res.render('pages/public/shop', { products , meta });
    }

    @Get('/product-details/:id')
    async productDetails(@Res() res: Response, @Param('id') id: string) {
        const product = await this.productService.getProductById(id);
        const relatedProducts = await this.productService.getRelatedProduct(id);
        return res.render('pages/public/product-details', { product , relatedProducts });
    }
}
