import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { Injectable } from "@nestjs/common";
import { OrderInput, OrderAddressBillInput, OrderProductBillInput } from "../model";
import { PrismaService } from "../../common";

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

   
}