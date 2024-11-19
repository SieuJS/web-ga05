import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { ProductController, ColourController } from './controller';
import { ProductService } from './service';
import { CategoryModule } from '../category/category.module';
@Module({
    imports: [CommonModule, CategoryModule],
    controllers: [ProductController, ColourController],
    providers: [ProductService],
    exports: [ProductService]
})

export class ProductModule {}
