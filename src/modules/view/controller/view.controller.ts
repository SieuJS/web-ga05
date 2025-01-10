import { Controller, Get, Param, Query, Req, Res, UseGuards,  } from "@nestjs/common";
import { Request, Response } from "express";
import { ProductService } from "../../product";
import { PaginateTransformPipe } from "../../common";
import { PaginationArgs } from "../../paginate";
import { SearchProductPipe } from "../../product/pipe/search-product.pipe";
import { AuthenticatedGuard } from "../../auth";
import { UserInSession, UserService } from "../../user";


@Controller( "/")
export class HomeController {
    constructor(
        private readonly productService: ProductService,
        private readonly userService : UserService
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

    @Get('/profile')
    @UseGuards( AuthenticatedGuard)
    async profile(@Req() req : Request,@Res() res: Response) {
        const userInSession = req.user as UserInSession;
        const user = await this.userService.getUserById(userInSession.id);
        return res.render('pages/public/profile', {user});
    }
}
