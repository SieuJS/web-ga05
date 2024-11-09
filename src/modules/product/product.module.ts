import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { ProductController } from './controller';
import { ProductService } from './service';
@Module({
    imports: [CommonModule],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService]
})

export class ProductModule {}
