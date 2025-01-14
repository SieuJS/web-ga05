import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { ProductController, ColourController } from './controller';
import { ProductReviewService, ProductService } from './service';
import { CategoryModule } from '../category/category.module';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
    imports: [CommonModule, CategoryModule, CacheModule.register()],
    controllers: [ProductController, ColourController],
    providers: [ProductService, ProductReviewService],
    exports: [ProductService, ProductReviewService]
})

export class ProductModule {}
