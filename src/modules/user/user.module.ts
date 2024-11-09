import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { UserController } from './controller';
import { UserService } from './service';


@Module({
    imports: [CommonModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
