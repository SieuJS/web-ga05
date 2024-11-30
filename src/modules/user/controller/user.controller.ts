import { Controller, Get, Post, Query,Body, HttpException, UseGuards, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { Request } from "express";
import { UserService } from "../service/user.service";
import { UserData, UserInput, UserInSession, UserLoginInput } from "../model/";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard, AuthenticatedGuard } from "../../auth";
import { UserInputPipe } from "../pipe/user-input.pipe";
import { AuthResponse } from "../model/";


@ApiTags('User')
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
    @UsePipes(ValidationPipe)
    @ApiResponse({ status: 200, description: 'User created successfully' , type: AuthResponse})
    async createUser(@Req() req : Request, @Body(UserInputPipe) data: UserInput): Promise<AuthResponse> {
        const existingUser = await this.userService.getUserByEmail(data.email);
        if (existingUser) {
            throw new HttpException('User with this email already exists', 400);
        }
        const existingUserName = await this.userService.getUserByUserName(data.username);
        if (existingUserName) {
            throw new HttpException('User with this username already exists', 400);
        }
        await this.userService.createUser(data);

        return await this.signIn(req);

    }

    @Post('login')
    @ApiOperation({ summary: 'Login the user' })
    @ApiResponse({ status: 200, description: 'User logged in successfully' , type: AuthResponse})
    @ApiBody( {description : "Input form", type : UserLoginInput})
    @UseGuards(LocalAuthGuard)
    async signIn(@Req() req : Request): Promise<AuthResponse> {
        const userInSession = req.user as UserInSession;
        return { ...userInSession,
            token: 'Bearer ' + req.sessionID};
    };

    @UseGuards(AuthenticatedGuard)
    @Get('/protected')
    @ApiOperation({ summary: 'Get the user information' })
    getHello(@Req() req : Request): AuthResponse {
        const userInSession = req.user as UserInSession;
        return { ...userInSession,
            token: 'Bearer ' + req.sessionID};
    }

    @Get('/logout')
    logout(@Req() req : any): any {
      req.session.destroy();
      return { msg: 'The user session has ended' }
    }
}