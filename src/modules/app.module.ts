import { Module } from '@nestjs/common';

import {ServeStaticModule} from '@nestjs/serve-static';
import { CommonModule } from './common';
import { PassengerModule } from './passenger/passenger.module';
import { join } from 'path';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', 'client'),
            exclude: ['/api/(.*)'],
        }),
        CommonModule,
        PassengerModule,
        ProductModule,
        UserModule
    ]
})
export class ApplicationModule {}
