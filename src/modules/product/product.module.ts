import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { ProductController, ColourController } from './controller';
import { ProductReviewService, ProductService } from './service';
import { CategoryModule } from '../category/category.module';
@Module({
    imports: [CommonModule, CategoryModule],
    controllers: [ProductController, ColourController],
    providers: [ProductService, ProductReviewService],
    exports: [ProductService, ProductReviewService]
})

export class ProductModule {}
