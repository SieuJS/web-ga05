import { Injectable, NotAcceptableException, Req } from "@nestjs/common";
import { UserInput, UserInSession, UserService } from "../../user";
import * as bcrypt from "bcrypt";
import { UserLoginInput } from "../../user";
import { Request } from "express";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UserService) {}
    async validateUser(input: UserLoginInput): Promise<UserInSession | null> {
        const user = await this.usersService.getUserByUserName(input.username);
        if (!user) {
            throw new NotAcceptableException("could not find the user");
        }
        if(user.status === "banned"){
            throw new NotAcceptableException("User is banned");
        }
        const passwordValid = await bcrypt.compare(
            input.password,
            user.password
        );
        if (user && passwordValid) {
            return {
                id: user.id,
                username: user.username,
                role: user.role,
                status: "active",
            };
        }
        return null;
    }
    async googleLogin(@Req() req: Request) {
        const user = req.user as UserInput;
        if (!req.user) {
            return "No user from google";
        }
        const existingUser = await this.usersService.getUserByEmail(user.email);
        if (!existingUser) {
            const newUser = await this.usersService.createUser(user);
            return {
                message: "User information from google",
                user: newUser,
            };
        }

        return {
            message: "User information from google",
            user: req.user,
        };
    }

    async validateGoogleUser(user: UserInput): Promise<UserInSession | null> {
        const existUser = await this.usersService.getUserByEmail(user.email);
        if (!existUser) {
            const newUser = await this.usersService.createUser(user);
            
            return {
                id: newUser.id,
                username: user.username,
                role: user.role,
                status: "active",
            } 
        }
        if(existUser.status === "banned"){
            throw new NotAcceptableException("User is banned");
        }
        return {
            id: existUser.id,
            username: user.username,
            role: user.role,
            status: "active",
        };
    }
}
