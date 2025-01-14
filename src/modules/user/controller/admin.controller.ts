import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { AuthResponse, UserInSession, UserLoginInput } from "../model";
import { AdminAuthGuard, AuthenticatedGuard } from "../../auth";

@ApiTags('admin')
@Controller('admin')
export class AdminController {
    constructor() {
    }
@Post('login')
    @ApiOperation({ summary: 'Login the user' })
    @ApiResponse({ status: 200, description: 'User logged in successfully' , type: AuthResponse})
    @ApiBody( {description : "Input form", type : UserLoginInput})
    @UseGuards(AdminAuthGuard)
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

}