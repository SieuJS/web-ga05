import { Injectable } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { UserData, UserInput } from "../model";
import { PrismaService } from "../../common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService{   
    constructor(
        private prisma: PrismaService,
        private txHost : TransactionHost<TransactionalAdapterPrisma>
    ) {}

    async createUser(data: UserInput): Promise<UserData> {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);

        const user = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
        return user as UserData;
    }

    async getListUsers(): Promise<UserData[]> {
        return this.prisma.user.findMany() as Promise<UserData[]>;
    }

    async signIn(username: string, password: string): Promise<UserData | null> {

        const user = await this.prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return null;
        }

        const passwordValid = await bcrypt.compare(password, user.password as string);
        if (!passwordValid) {
            return null;
        }
        return user as UserData;
    }
    async checkPassword(username : string, password: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return false;
        }
        return bcrypt.compare(password, user.password as string);
    }

    async getUserById(id: string): Promise<UserData> {
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

    async getUserByUserName(username: string): Promise<UserData> {
        const user = await this.txHost.tx.user.findFirst({
            where : {
                username : {
                    equals : username,
                    mode : "insensitive"
                }
            }
        });
        return user as UserData;
    }
}
