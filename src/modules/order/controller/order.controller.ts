import { Controller, UseGuards, Req, Body, Post, HttpException, Get, Param, Query, Patch, Ip, Res } from "@nestjs/common";
import { OrderService } from "../service";
import { AuthenticatedGuard } from "../../auth";
import { OrderAddressBillInput, OrderInput, OrderProductBillInput } from "../model";
import { Transactional } from "@nestjs-cls/transactional";
import { CartService } from "../../cart/service";
import { ProductService } from "../../product";
import { ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PaginateTransformPipe, PaginationArgs } from "../../paginate";
import { SortOrderTransformPipe } from "../pipe/sort-order-transform.pipe";
import { Request, Response } from "express";
import * as moment from 'moment';
import { createHmac } from "node:crypto";

@ApiTags('Order')
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
            userId : userInSession.id,
            paymentStatus : 'PENDING'
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

    @Get('/info/:id')
    @ApiParam({name : 'id', type : 'string'})
    async getOrderById(@Req() req : any,@Param('id') orderId : string ) : Promise<any> {
        const order = await this.orderSerivce.getOrderById(orderId);
        return {
            data : order,
            message : 'Get order by id'
        };
    }

    @Get('/getlist')
    @ApiQuery({name : "status", required : false})
    @ApiQuery({name : "orderBy", required : false})
    @ApiQuery({name : "order", required : false})
    async getListOrder( @Query('status') status : string, @Query(PaginateTransformPipe) paginationArgs : PaginationArgs, @Query(SortOrderTransformPipe)orderBy : any ) : Promise<any> {
        const orderOfUser = await this.orderSerivce.getListOrder({status}, paginationArgs, orderBy);
        return orderOfUser;
    }

    @Patch('/update/:orderId')
    @ApiParam({name : 'orderId', type : 'string'})
    async updateOrder(@Param('orderId') orderId : string, @Body() data : any) : Promise<any> {
        const order = await this.orderSerivce.updateOrder(orderId, data.status);
        return {
            data : order,
            message : 'Order updated'
        }
    }

    @Get('/vnpay/:orderId')
    @ApiParam({name : 'orderId', type : 'string'})
    async vnPayPayment(@Param('orderId') orderId : string, @Req() req : Request, @Ip() ip : any) : Promise<any> {
        const price = await this.orderSerivce.vnPayPayment(orderId);

        const secretKey = "D20CQAP41H71RIW04VEAMNF1E29KF8KM";
        const date = moment();
        var vnp_Params  : any = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = "VE9ZI7PL";
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_IpAddr'] = "172.67.208.232";
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = "BookStore";
        vnp_Params['vnp_OrderType'] = "pay";
        vnp_Params['vnp_Amount'] = parseInt((price * 10000).toString());
        vnp_Params['vnp_ReturnUrl'] = "http://localhost:3000/api/v1/order/vnpay-callback";
        vnp_Params['vnp_CreateDate'] = date.format('YYYYMMDDHHmmss');
        const sortedParams = sortParams(vnp_Params);
        const urlParams = new URLSearchParams();
        for (let [key, value] of Object.entries(sortedParams)) {
          urlParams.append(key, value as string);
        }
      const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
        const querystring = urlParams.toString();
        var hmac = createHmac("sha512", secretKey);
        const signed = hmac.update(querystring).digest("hex");
        urlParams.append("vnp_SecureHash", signed);
        const paymentUrl = `${vnpUrl}?${urlParams.toString()}`;

        return {
            data : paymentUrl,
            message : 'Order payment'
        }
    }

    @Get('/vnpay-callback')
    async vnPayCallback(@Req() req : Request, @Res() res : Response) : Promise<any> {
        const { vnp_ResponseCode, vnp_TxnRef } = req.query;
        try {
          if (!vnp_ResponseCode || !vnp_TxnRef) {
            return new HttpException("Invalid request", 400);
          }
      
        const order = await this.orderSerivce.getOrderById(vnp_TxnRef as string);
        if (!order) {
          return new HttpException("Order not found", 404);
        }
        if (order.status === "SUCCESS") {
          return new HttpException("Order already paid", 400);
        }
        if (vnp_ResponseCode === "00") {
          await this.orderSerivce.updatePaymentStatus(vnp_TxnRef as string, "SUCCESS");
        } else {
          await this.orderSerivce.updatePaymentStatus(vnp_TxnRef as string, "FAILED");
        } 
        res.redirect('/order');

        }catch (error) {
          return new HttpException(error.message, 400);
        }
    }

}

function sortParams(obj : any) {
    const sortedObj = Object.entries(obj)
      .filter(
        ([key, value]) => value !== "" && value !== undefined && value !== null
      )
      .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
      .reduce((acc : any, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  
    return sortedObj;
  }