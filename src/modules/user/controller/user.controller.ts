import { Controller, Get, Post, Query,Body, HttpException } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { UserData, UserInput } from "../model/";
import { ApiResponse } from "@nestjs/swagger";

class AuthResponse  extends UserData {
    token: string;
}


@Controller('user')
export class UserController {
    constructor (private userService : UserService){
        this.userService = userService
    }

    @Get()
    async getUserById(@Query() id: string) : Promise<UserData> {
        return this.userService.getUserById(id);
    }

    @Post("signup")
    @ApiResponse({ status: 200, description: 'User created successfully' , type: AuthResponse})
    async createUser(@Body() data: UserInput): Promise<AuthResponse> {
        const existingUser = await this.userService.getUserByEmail(data.email);
        if (existingUser) {
            throw new HttpException('User with this email already exists', 400);
        }
        const newUser = await this.userService.createUser(data);
        return {
            ...newUser,
            token : 'Bearer ' + newUser.id
        }
    }

    @Post('login')
    @ApiResponse({ status: 200, description: 'User logged in successfully' , type: AuthResponse})
    async signIn(@Body() data: { email: string, password: string }): Promise<AuthResponse> {
        console.log("login" , data)
        const user = await this.userService.signIn(data.email, data.password);
        if (!user) {
            throw new HttpException('Invalid email or password', 401);
        }
        return {
            ...user ,
            token : 'Bearer ' + user.id
        }
    };
}