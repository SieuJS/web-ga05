import { Module } from '@nestjs/common';

import {ServeStaticModule} from '@nestjs/serve-static';
import { CommonModule } from './common';
import { join } from 'path';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', 'client'),
            exclude: ['/api/(.*)'],
        }),
        CommonModule,
        ProductModule,
        UserModule,
        CategoryModule
    ]
})
export class ApplicationModule {}
