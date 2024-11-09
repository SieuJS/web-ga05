import { Injectable } from "@nestjs/common";
import { UserData, UserInput } from "../model";
import { PrismaService } from "../../common";
import * as crypto from 'crypto';

@Injectable()
export class UserService{   
    constructor(private prisma: PrismaService) {}

    async createUser(data: UserInput): Promise<UserData> {
        const hashedPassword = crypto.createHash('sha256').update(data.password).digest('hex');
        const user = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
        return user as UserData;
    }
    async checkPassword(email: string, password: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return false;
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        return user.password === hashedPassword;
    }

    async getUserById(id: number): Promise<UserData> {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        return user as UserData;
    }

    async getUserByEmail(email: string): Promise<UserData> {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });
        return user as UserData;
    }
}
