import { Controller, UseGuards, Req, Body, Post, HttpException, Get } from "@nestjs/common";
import { OrderService } from "../service";
import { AuthenticatedGuard } from "../../auth";
import { OrderAddressBillInput, OrderInput, OrderProductBillInput } from "../model";
import { Transactional } from "@nestjs-cls/transactional";
import { CartService } from "../../cart/service";
import { ProductService } from "../../product";

@Controller('order')
export class OrderController {
    constructor (
        private readonly orderSerivce : OrderService,
        private readonly cartService : CartService,
        private readonly productService : ProductService
    ){}

    @UseGuards(AuthenticatedGuard)
    @Get('/get')
    async getOrderByUserId(@Req() req : any) : Promise<any> {
        const userInSession = req.user ; 
        const orderOfUser = await this.orderSerivce.getOrderByUserId(userInSession.id);
        return {
            data : orderOfUser,
            message : 'Get order by user id'
        };
    }

    @UseGuards(AuthenticatedGuard)
    @Post('/create')
    @Transactional()
    async createOrder(@Req() req : any, @Body() input : any  ) : Promise<any> {
        const addressBill = input.addressInfor as OrderAddressBillInput;

        let productsBill = input.productList as OrderProductBillInput[];

        productsBill = productsBill.map((product) => {
            return {
                ...product,
                price : parseFloat(product.price as any),
            }
        })
        const totalPrice = parseFloat(input.totalPrice);
        const userInSession = req.user ; 
        const orderInput : OrderInput = {
            totalPrice : totalPrice,
            status : 'PENDING',
            userId : userInSession.id
        }
        orderInput.userId = userInSession.id;
        await this.cartService.clearCart(userInSession.id);
        productsBill.map(async (product) => {
            const productInstock = await this.productService.getProductById(product.productId);
            const quantityDiff = productInstock.quantity - product.quantity;
            if(quantityDiff < 0) {
                throw new HttpException('Product out of stock', 400);
            }
            await this.productService.updateQuantity(product.productId, product.quantity, false);
        });
        const order = await this.orderSerivce.createOrder(orderInput, addressBill, productsBill);

        return {
            order,
            message : 'Order created'
        }
    }
}