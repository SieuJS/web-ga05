import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { ProductController, ColourController } from './controller';
import { ProductService } from './service';
@Module({
    imports: [CommonModule],
    controllers: [ProductController, ColourController],
    providers: [ProductService],
    exports: [ProductService]
})

export class ProductModule {}
