import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional  } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {ServeStaticModule} from '@nestjs/serve-static';
import { AuthModule } from './auth';
import { CommonModule } from './common';
import { join } from 'path';
import { ProductModule } from './product/product.module';
import { UserModule } from './user';
import { CategoryModule } from './category/category.module';
import { PrismaService } from './common';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
    imports: [
        ClsModule.forRoot({
            plugins: [
                new ClsPluginTransactional({
                    imports: [
                      // module in which the PrismaClient is provided
                      CommonModule
                    ],
                    adapter: new TransactionalAdapterPrisma({
                        // the injection token of the PrismaClient
                        prismaInjectionToken: PrismaService,
                    }),
                }),
            ],
            global: true,
            middleware: { mount: true },
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', 'client'),
            exclude: ['/api/(.*)'],
        }),
        AuthModule,
        ProductModule,
        UserModule,
        CategoryModule,
        CartModule,
        OrderModule
    ]
})
export class ApplicationModule {}
