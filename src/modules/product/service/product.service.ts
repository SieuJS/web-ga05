import { ProductData, ProductInput, ProductPaginatedResult } from "../model";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { PrismaService } from "../../common";
import { Injectable } from "@nestjs/common";
import { PaginationArgs } from "../../paginate";
import { PaginatorTypes, paginator } from '@nodeteam/nestjs-prisma-pagination';

const paginate: PaginatorTypes.PaginateFunction = paginator({perPage : 10, page : 1});

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService,
        private txHost : TransactionHost<TransactionalAdapterPrisma>
    ) {}
    async createProduct(data: ProductInput): Promise<ProductData> {
        const product = await this.prisma.product.create({
            data: {
                ...data,
                images : {
                  createMany : {
                    data : data.images?.map(image => ({image})) || []
                  }
                }
            }
        });
        return product as ProductData;
    }

    async getListProduct(where : any ,paginationArgs : PaginationArgs, orderBy? : any ): Promise<ProductPaginatedResult> {
        let products : ProductPaginatedResult; ;

        if(where.categoryId)
        {
          products = await paginate(this.prisma.product, 
            {
              where :{    
                AND: [
                        {OR:[
                          {
                            name: {
                                contains: where.search || "",
                                mode: "insensitive",
                            },
                        },
                        {
                            description: {
                                contains: where.search || "",
                                mode: "insensitive",
                            },
                        },
                        ]},
                        {
                            season: {
                                contains: where.season || "",
                                mode: "insensitive",
                            },
                        },
                        {
                            baseColour: {
                                contains: where.baseColor || "",
                                mode: "insensitive",
                            },
                        },
                        {
                            price: {
                                gte: parseInt(where.minPrice) || 0,
                                lte: parseInt(where.maxPrice) || 10000000,
                            },
                        },
                        {
                            categoryId: {...where.categoryId },
                        },
                    ]
                },
              orderBy
            } ,
            paginationArgs
          ) 
        }
        else {
          products = await paginate(this.prisma.product, 
            {
              where :{
                AND : [
                  {OR:[
                    {
                      name: {
                          contains: where.search || "",
                          mode: "insensitive",
                      },
                  },
                  {
                      description: {
                          contains: where.search || "",
                          mode: "insensitive",
                      },
                  },
                  ]},
                  {
                    season : {
                      contains : where.season || '',
                      mode : 'insensitive'

                    }
                  },
                  {
                    baseColour : {
                      contains : where.baseColor || '',
                      mode : 'insensitive'

                    }
                  },
                  {
                    price : {
                      gte : parseInt(where.minPrice) || 0,
                      lte : parseInt(where.maxPrice) || 10000000
                    }
                  }
                ]
              },
              orderBy
            }, 
            paginationArgs
          )
        }
        return products;
    }

    async getProductById(id: string): Promise<ProductData> {
        const product = await this.prisma.product.findUnique({
            where: { id }
        });
        return product as ProductData;
    }

    async getAllColour(): Promise<string[]> {
        const colours = await this.prisma.product.findMany({
            distinct: ['baseColour'],
            select: {
                baseColour: true
            }
        });
        return colours.map(colour => colour.baseColour) as string[];
    }

    async getListColour(limit: number = 10): Promise<string[]> {

        const colourCounts = await this.prisma.product.groupBy({
            by : ['baseColour'],
            _count : {
                _all : true
            },
            orderBy : {
                baseColour : 'asc'
            },
            take : parseInt(limit.toString())
        });
        return colourCounts.map(colour => `${colour.baseColour}: ${colour._count._all}`) as string[];
    }

    async getRelatedProduct(id: string, take : number = 4): Promise<ProductData[]> {
        const product = await this.prisma.product.findUnique({
            where: { id }
        }) as ProductData;
        const relatedProducts = await this.prisma.product.findMany({
            where: {
              OR: [
                {
                  categoryId: product.categoryId,
                }
              ],
              NOT: {
                id: product.id
              }
            },
            take 
        });
        return relatedProducts as ProductData[];
    }

    async getNewArrivalProduct(take : number = 8): Promise<ProductData[]> {

      const MenCasualProducts = await this.prisma.product.findMany({
        where : {
          gender : "Men" , 
          usage : "Casual"
        },
        take : 2
      })  as ProductData[]; 

      const MenFormalProducts = await this.prisma.product.findMany({
        where : {
          gender : "Men" , 
          usage : "Formal"
        },
        take : 2
       }) as ProductData[];

      const MenSportsProducts = await this.prisma.product.findMany({
        where : {
          gender : "Men",
          usage : "Sports"
        },
        take : 2
       }) as ProductData[];

      const WomenCasualProducts = await this.prisma.product.findMany({
        where : {
          gender : "Women" , 
          usage : "Casual"
        },
        take : 2
      }) as ProductData[];

      const WomenFormalProducts = await this.prisma.product.findMany({
        where : {
          gender : "Women" , 
          usage : "Formal"
        },
        take : 2
      }) as ProductData[];

      const WomenSportsProducts = await this.prisma.product.findMany({
        where : {
          gender : "Women",
          usage : "Sports"
        },
        take : 2
      }) as ProductData[];

      const products = [...MenCasualProducts, ...MenFormalProducts, ...MenSportsProducts, ...WomenCasualProducts, ...WomenFormalProducts, ...WomenSportsProducts]
        return products;
    }

    async updateQuantity(productId : string , quantity : number, isAdd : boolean = true) : Promise<ProductData> {
      const product = await this.txHost.tx.product.findUnique({
        where : {
          id : productId
        }});
        if (!product) {
          throw new Error('Product not found');
        }
      if(!isAdd){
        if(product.quantity < quantity) {
          throw new Error('Product out of stock');
        }
        return this.txHost.tx.product.update({
          where : {
            id : productId
          },
          data : {
            quantity : product.quantity - quantity
          }
        });
      }
      return this.txHost.tx.product.update({
        where : {
          id : productId
        },
        data : {
          quantity : product.quantity + quantity
        }
      });
    }
    public async createProductWithCategory(data: ProductInput, categoryId : string): Promise<ProductData> {
        const product = await this.prisma.product.create({
            data : {
                ...data,
                status : data.status || "instock",
                categoryId,
                images : {
                    createMany : {
                        data : data.images?.map(image => ({image})) || []
                    }
                }
            }
        });
        return product as ProductData;
    }

    public async getUniqueProductAdmin(id: string): Promise<ProductData> {
        const product = await this.prisma.product.findUnique({
            where: { id } ,
            include : {
              images : true,
              tbl_categories : true
            }
        });

        return product as ProductData;
    }
    
    public async updateProduct(id: string, data: ProductInput, categoryId : string): Promise<ProductData> {
        const product = await this.prisma.product.update({
            where: { id },
            data: {
                ...data,
                categoryId,
                images : {
                    deleteMany : {},
                    createMany : {
                        data : data.images?.map(image => ({image})) || []
                    }
              }
            }
        });
        return product as ProductData;
    }
}