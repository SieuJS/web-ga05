import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { CategoryController } from './controller';
import { CategoryService } from './service';

@Module({
    imports: [CommonModule],
    controllers: [CategoryController],
    providers: [CategoryService]
})
export class CategoryModule {}
