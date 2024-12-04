import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { UserModule } from '../user';
import { ProductModule } from '../product/product.module';
import { CartController } from './controller';
import { CartService } from './service';
import { CommonModule } from '../common';
@Module({
    imports: [AuthModule, UserModule, ProductModule, CommonModule],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService]
})
export class CartModule {}
