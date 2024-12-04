import { Controller, Post, Req, UseGuards, Body } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {Transactional} from "@nestjs-cls/transactional"

import { CartInput, CartResponseData } from "../model";
import { CartService } from "../service/cart.service";
import { ApiBody } from "@nestjs/swagger";
import { AuthenticatedGuard } from "../../auth";
import { ProductService } from "../../product";

@ApiTags('Cart')
@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService : CartService,
        private readonly productService : ProductService
    ) {}

    @UseGuards (AuthenticatedGuard)
    @Transactional()
    @Post('/get')
    @ApiOperation({summary : 'Get cart by user id'})
    @ApiResponse({status : 200, description : 'Get cart by user id', type : CartResponseData})
    async getCartByUserId(@Req() req : any) : Promise<CartResponseData> {
        const userInSession = req.user ; 
        const cartOfUser = await this.cartService.getCartByUserId(userInSession.id);
        return {
            data : cartOfUser,
            message : 'Get cart by user id'
        };
    }


    @UseGuards(AuthenticatedGuard)
    @Transactional()
    @Post('/add') 
    @ApiOperation({summary : 'Add item to cart'})
    @ApiBody({type :  CartInput})
    @ApiResponse({status : 200, description : 'Item added to cart', type : CartResponseData})
    async addItemToCart(@Req() req : any, @Body() input : CartInput) : Promise<CartResponseData> {
        const userInSession = req.user ; 
        input.userId = userInSession.id;
        await this.productService.updateQuantity(input.productId as string, input.quantity, false)
            
        await this.cartService.addItemToCart(input);
            
        const cartOfUser = await this.cartService.getCartByUserId(userInSession.id);
            
        return {
            data : cartOfUser,
            message : 'Item added to cart'
        };
    }

    @UseGuards(AuthenticatedGuard)
    @Transactional()
    @Post('/remove')
    @ApiOperation({summary : 'Remove item from cart'})
    @ApiBody({type :  CartInput})
    @ApiResponse({status : 200, description : 'Item removed from cart', type : CartResponseData})
    async removeItemFromCart(@Req() req : any, @Body() input : CartInput) : Promise<CartResponseData> {
        const userInSession = req.user ; 
        input.userId = userInSession.id;
        await this.productService.updateQuantity(input.productId as string, input.quantity, true)
            
        await this.cartService.removeItemFromCart(input);
            
        const cartOfUser = await this.cartService.getCartByUserId(userInSession.id);
            
        return {
            data : cartOfUser,
            message : 'Item removed from cart'
        };
    }
}