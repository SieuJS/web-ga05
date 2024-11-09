import { Controller, Get, Post, Query,Body } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { UserData, UserInput } from "../model/";

@Controller('user')
export class UserController {
    constructor (private userService : UserService){
        this.userService = userService
    }

    @Get()
    async getUserById(@Query() id: number) : Promise<UserData> {
        return this.userService.getUserById(id);
    }

    @Post()
    async createUser(@Body() data: UserInput): Promise<UserData> {
        const existingUser = await this.userService.getUserByEmail(data.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        return this.userService.createUser(data);
    }
}