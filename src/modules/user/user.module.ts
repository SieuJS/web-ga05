import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { UserController } from './controller';
import { UserService } from './service';
import { ProductModule } from '../product/product.module';


@Module({
    imports: [CommonModule, ProductModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
