import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { Injectable } from "@nestjs/common";
import { OrderInput, OrderAddressBillInput, OrderProductBillInput } from "../model";
import { PrismaService } from "../../common";
import { PaginationArgs } from "../../paginate";
import { paginator, PaginatorTypes } from "@nodeteam/nestjs-prisma-pagination";

@Injectable()
export class OrderService {
    constructor (
        private txHost : TransactionHost<TransactionalAdapterPrisma> ,
        private prismaService : PrismaService
    ){}

    async createOrder(orderInput : OrderInput , orderAdressBillInput : OrderAddressBillInput, orderProductBillInputs : OrderProductBillInput[]) : Promise<any> {
        const user = await this.txHost.tx.user.findUnique({
            where : {
                id : orderInput.userId
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return this.txHost.tx.order.create({
            data : {
                ...orderInput,
                orderDate : new Date(),
                order_bill_address : {
                    create : orderAdressBillInput,
                },
                order_bill_product : {
                    createMany : {
                        data : orderProductBillInputs
                    }
                }
            }
        });
    }

    async createOrderProduct(orderId : string, orderProductBillInput : OrderProductBillInput[]) : Promise<any> {
        const orderProduct = orderProductBillInput.map((product) => {
            return {
                ...product,
                orderId : orderId
            }
        });

        return this.prismaService.orderProductBill.createMany({
            data : orderProduct
        });
    }

    async getOrderByUserId(userId : string) : Promise<any> {
        return this.txHost.tx.order.findMany({
            where : {
                userId : userId
            },
    });
    }

   async getOrderById(orderId : string) : Promise<any> {
        return this.txHost.tx.order.findUnique({
            where : {
                id : orderId
            },
            include : {
                order_bill_product : true,
                order_bill_address : true,
                order_of_user : true
            }
        });
    }

    async getListOrder(where : any , paginationArgs : PaginationArgs, orderBy : any) : Promise<any> {
        const paginate: PaginatorTypes.PaginateFunction = paginator({perPage : 10, page : 1});

        return paginate(this.prismaService.order, {
            where : {
                status : {
                    contains : where?.status || "",
                    mode : "insensitive"
                }
            },
            include : {
                order_of_user : true
            },
            orderBy
        }, paginationArgs );
    }

    async updateOrder (orderId : string , status : string) {
        return this.txHost.tx.order.update({
            where : {
                id : orderId
            },
            data : {
                status : status
            }
        });
    }

    async updatePaymentStatus (orderId : string , status : string) {
        return this.txHost.tx.order.update({
            where : {
                id : orderId
            },
            data : {
                paymentStatus : status
            }
        });
    }

    async vnPayPayment (orderId : string) {
        const order = await this.txHost.tx.order.findUnique({
            where : {
                id : orderId
            }
        });

        if (!order) {
            throw new Error('Order not found');
        }

        return order.totalPrice;
    }


}