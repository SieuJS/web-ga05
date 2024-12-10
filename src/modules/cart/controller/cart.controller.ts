import { Controller, Post, Req, UseGuards, Body, Get, Delete, Param, Patch, HttpException } from "@nestjs/common";
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
    @Get('/get')
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
    async addItemToCart( @Body() input : any,@Req() req : any,) : Promise<CartResponseData> {

        const userInSession = req.user ; 
        input.userId = userInSession.id;

        input.quantity = parseInt(input.quantity as any);
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

    @UseGuards(AuthenticatedGuard)
    @Transactional()
    @Delete('remove/:prodId')
    @ApiOperation({summary : 'Remove item from cart'})
    @ApiResponse({status : 200, description : 'Item removed from cart', type : CartResponseData})
    async removeItemFromCartByProductId(@Req() req : any, @Param('prodId') prodId : string ) : Promise<CartResponseData> {
        const userInSession = req.user ; 
        const productId = prodId;
        await this.cartService.removeItemFromCart({userId : userInSession.id, productId, quantity : 1});

        const cartOfUser = await this.cartService.getCartByUserId(userInSession.id);

        return {
            data : cartOfUser,
            message : 'Item removed from cart'
        };
    }

    @UseGuards(AuthenticatedGuard)
    @Transactional()
    @Patch('/add/:prodId')
    @ApiOperation({summary : 'Add item to cart and return current cart'})
    @ApiResponse({status : 200, description : 'Item added to cart', type : CartResponseData})
    async addOneItemToCart(@Req() req : any, @Param('prodId') prodId : string) : Promise<CartResponseData> {
        const userInSession = req.user ; 
        const productId = prodId;
            
        await this.cartService.addItemToCart({userId : userInSession.id, productId, quantity : 1});
            
        const cartOfUser = await this.cartService.getCartByUserId(userInSession.id);
            
        return {
            data : cartOfUser,
            message : 'Item added to cart'
        };
    }

    @UseGuards(AuthenticatedGuard)
    @Transactional()
    @Patch('/update')
    @ApiOperation({summary : 'Update item in cart'})
    @ApiBody({type :  CartInput, isArray : true})
    @ApiResponse({status : 200, description : 'Item updated in cart', type : CartResponseData})
    async updateItemInCart(@Req() req : any, @Body() inputs : CartInput[]) : Promise<CartResponseData> {
        const userInSession = req.user ; 
        for (let input of inputs) {
            input.quantity = parseInt(input.quantity as any);
            if(input.quantity <= 0) {
                await this.cartService.clearItemInCart(userInSession.id, input.productId as string);
            }
            else {
            const productInStock = await this.productService.getProductById(input.productId as string);
            console.log('cart contro', productInStock.quantity < input.quantity)
            if(productInStock.quantity < input.quantity) {
                console.log('cart contro', productInStock.quantity)
                throw new HttpException('Product out of stock', 400);
            }
            await this.cartService.updateItemInCart(input);
            }
        }
        const cartOfUser = await this.cartService.getCartByUserId(userInSession.id);
        return {
            data : cartOfUser,
            message : 'Item updated in cart'
        };
    }

    @UseGuards(AuthenticatedGuard)
    @Delete('/clear')
    @ApiOperation({summary : 'Clear cart'})
    @ApiResponse({status : 200, description : 'Cart cleared', type : CartResponseData})
    async clearCart(@Req() req : any) : Promise<CartResponseData> {
        const userInSession = req.user ; 
        await this.cartService.clearCart(userInSession.id);
        return {
            data : null,
            message : 'Cart cleared'
        };
    }
}