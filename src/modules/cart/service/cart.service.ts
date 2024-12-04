import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common";
import { CartData, CartInput } from "../model";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { CartWithProductData } from "../model/related/cart-with-product.data";
import { selectCartWithProductQuery } from "../query/selectCartWithProduct.query";


@Injectable()
export class CartService {
    constructor (
        private readonly prismaSerivce : PrismaService,
        private readonly txHost : TransactionHost<TransactionalAdapterPrisma>
    ) {}

    async getCartByUserId(userId: string) : Promise<CartWithProductData[]> {
        return this.txHost.tx.cart.findMany({
            where : {
                userId : userId
            },
            select : selectCartWithProductQuery
        }) as Promise<CartWithProductData[]>;
    }
    async createCart(userId: string) : Promise<CartData> {
        const user = await this.prismaSerivce.user.findUnique({
            where : {
                id : userId
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return this.prismaSerivce.cart.create({
            data : {
                userId : user.id,// default or appropriate value
                quantity: 1 // default or appropriate value
            }
        });
    }
    async addItemToCart(input : CartInput) : Promise<CartWithProductData> {
        console.log('get in add to cart')
        const productInCart = await this.prismaSerivce.cart.findFirst({
            where :{
                userId : input.userId,
                productId : input.productId
            }
        });

        if(productInCart) {
            return await this.txHost.tx.cart.update({
                where : {
                    id : productInCart.id
                },
                data : {
                    quantity : productInCart.quantity + input.quantity
                },
                select :{
                    products_in_cart : {
                        select : {
                            image : true,
                            name : true,
                            price : true,
                        }
                    }
                }
            }) as CartWithProductData; 
        }
        else {
            return await this.txHost.tx.cart.create({
                data : {
                    userId : input.userId,
                    productId : input.productId,
                    quantity : input.quantity
                },
                select :selectCartWithProductQuery
            }) as CartWithProductData;
        }
    }

    async removeItemFromCart(input : CartInput) : Promise<CartWithProductData | null> {
        const productInCart = await this.txHost.tx.cart.findFirst({
            where :{
                userId : input.userId,
                productId : input.productId
            },
            
        });

        if(productInCart) {
            if(productInCart.quantity - input.quantity <= 0) {
                return await this.txHost.tx.cart.delete({
                    where : {
                        id : productInCart.id
                    },
                    select : selectCartWithProductQuery
                }) as CartWithProductData;
            }
            else {
                return await this.txHost.tx.cart.update({
                    where : {
                        id : productInCart.id
                    },
                    data : {
                        quantity : productInCart.quantity - input.quantity
                    },
                    select : selectCartWithProductQuery
                }) as CartWithProductData;
            }
        }
        else {
            throw new HttpException('Product not found in cart',402);
        }
    }
}