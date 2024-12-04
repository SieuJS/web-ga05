import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';
import { AuthModule } from '../auth';
import { OrderService } from './service';
import { OrderController } from './controller';

@Module({
    imports: [CommonModule, AuthModule, CartModule, ProductModule],
    providers: [OrderService],
    controllers : [OrderController],
    exports: [OrderService]
})
export class OrderModule {}
