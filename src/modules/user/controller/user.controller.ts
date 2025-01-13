import { Controller, Get, Post, Query,Body, HttpException, UseGuards, Req, UsePipes, ValidationPipe, Patch, Param } from "@nestjs/common";
import { Request } from "express";
import { UserService } from "../service/user.service";
import { UpdateInforInput, UserData, UserInput, UserInSession, UserLoginInput, UserPaginatedResult } from "../model/";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import {  AuthenticatedGuard, LocalAuthGuard} from "../../auth";
import { UserInputPipe } from "../pipe/user-input.pipe";
import { AuthResponse } from "../model/";
import { PaginateTransformPipe } from "../../common";
import { PaginationArgs } from "../../paginate";
import { SearchUserPipe, SortOrderUserPipe } from "../pipe";
import { ProductReviewService } from "../../product";


@ApiTags('User')
@Controller('user')
export class UserController {
    constructor (
        private userService : UserService,
        private readonly productReviewService : ProductReviewService

    ){}
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
        data.status = 'active';
        const user = await this.userService.createUser(data);

        return {id : user.id,  username : user.username, role : user.role, token: 'Bearer ' + req.sessionID , status : user.status};
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

    @Get('/list')
    @ApiOperation({ summary: 'Get all user' })
    @ApiQuery({ name: 'name', required: false})
    @ApiQuery({ name: 'email', required: false})
    @ApiQuery({ name: 'orderBy', required: false})
    @ApiQuery({ name: 'order', required: false})
    @ApiResponse({ status: 200, description: 'Get all user' , type : UserPaginatedResult})
    async getListUser(@Query(PaginateTransformPipe) paginationArgs : PaginationArgs , @Query(SearchUserPipe)searchUser : any, @Query(SortOrderUserPipe) orderBy : any ): Promise<UserPaginatedResult> {

        return this.userService.getListUsers(searchUser , paginationArgs, orderBy);
    }

    @Patch('ban/:id')
    @ApiParam({name : 'id'})
    @ApiOperation({ summary: 'Ban the user' })
    async banUser(@Req() req : Request, @Param('id') id: string): Promise<UserData> {
        return this.userService.banUser(id);
    }

    @Patch('unban/:id')
    @ApiParam({name : 'id'})
    @ApiOperation({ summary: 'Unban the user' })
    async unBanUser(@Req() req : Request, @Param('id') id: string): Promise<UserData> {
        return this.userService.unBanUser(id);
    }

    @Patch('profile')
    @ApiBody({description : "Input form", type : UpdateInforInput})
    @ApiOperation({ summary: 'Update the user profile' })
    @UseGuards(AuthenticatedGuard)
    async updateProfile(@Req() req : Request, @Body() data: UpdateInforInput): Promise<any> {
        const userInSession = req.user as UserInSession;
        await this.userService.updateProfile(userInSession.id, data);
        return {message : 'Update profile successfully', success : true};
    }

    @Post('review/:productId')
    @ApiOperation({ summary: 'Review the user' })
    @ApiParam({name : 'product id'})
    async reviewUser(@Req() req : Request, @Body() data: any, @Param('productId')productId : string ): Promise<any> {
        const userInSession = req.user as UserInSession;
        await this.productReviewService.createReview({
            userId : userInSession.id,
            productId : productId,
            rating : parseInt(data.rating),
            review : data.review
        })
        return {message : 'Review user successfully', success : true};
    }

}