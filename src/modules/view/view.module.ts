import { Module } from '@nestjs/common';
import { HomeController } from './controller';
import { HomeService } from './service';
import { ProductModule } from '../product/product.module';
import { CommonModule } from '../common';
import { PaginateModule } from '../paginate/paginate.module';
import { CategoryModule } from '../category/category.module';
import { UserModule } from '../user';
@Module({
    imports: [CommonModule,PaginateModule,ProductModule , CategoryModule, UserModule],
    controllers: [HomeController],
    providers: [HomeService]
})
export class ViewModule {}
