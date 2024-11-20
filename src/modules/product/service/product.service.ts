import { ProductData, ProductInput } from "../model";
import { PrismaService } from "../../common";
import { Injectable } from "@nestjs/common";
import { paginate, PaginationArgs, PaginationOptions } from 'nestjs-prisma-pagination';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}
    async createProduct(data: ProductInput): Promise<ProductData> {
        const product = await this.prisma.product.create({
            data
        });
        return product as ProductData;
    }

    async getListProduct(where : any ,paginationArgs : PaginationArgs = {}, paginationOptions : PaginationOptions = {}): Promise<ProductData[]> {
        const query = paginate({limit: 10, ...paginationArgs}, {orderBy : {id : 'asc'}, ...paginationOptions}, );
        let products ;
        if(where.categoryId)
        {
          products = await this.prisma.product.findMany(
            {
                ...query,
              where : {
                AND : [
                  {
                    name : {
                      contains : where.search || '',
                      mode : 'insensitive'
                    }
                  },
                  {
                    description : {
                        contains : where.search || '',
                        mode : 'insensitive'
                    }
                  },
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
                  },
                  {
                    categoryId : where.categoryId || null
                  }
                ]}
          })
        }
        else {
          products = await this.prisma.product.findMany(
            {
              ...query,
            where : {
              AND : [
                {
                  name : {
                    contains : where.search || '',
                    mode : 'insensitive'
                  }
                },
                {
                  description : {
                      contains : where.search || '',
                      mode : 'insensitive'
                  }
                },
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
              ]}
            }
          )
        }

        return products as ProductData[];
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
}