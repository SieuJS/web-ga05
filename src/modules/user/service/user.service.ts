import { Injectable } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { UserData, UserInput, UserPaginatedResult } from "../model";
import { PrismaService } from "../../common";
import * as bcrypt from "bcrypt";
import { PaginationArgs } from "../../paginate";
import { paginator, PaginatorTypes } from "@nodeteam/nestjs-prisma-pagination";

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private txHost: TransactionHost<TransactionalAdapterPrisma>
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

    async getListUsers(
        where: any,
        paginateArgs: PaginationArgs,
        orderBy?: any
    ): Promise<UserPaginatedResult> {
        const paginate: PaginatorTypes.PaginateFunction = paginator({
            perPage: 10,
            page: 1,
        });
        let users: UserPaginatedResult;

        users = await paginate(this.prisma.user, {
            where: {
                AND: [
                    {
                        username: {
                            contains: where.name || "",
                            mode: "insensitive",
                        },
                    },
                    {
                        email: {
                            contains: where.email || "",
                            mode: "insensitive",
                        },
                    },
                ],
            },
            orderBy: orderBy || undefined,
        },
        paginateArgs
    );
        return users;
    }

    async signIn(username: string, password: string): Promise<UserData | null> {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return null;
        }

        const passwordValid = await bcrypt.compare(
            password,
            user.password as string
        );
        if (!passwordValid) {
            return null;
        }
        return user as UserData;
    }
    async checkPassword(username: string, password: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return false;
        }
        return bcrypt.compare(password, user.password as string);
    }

    async getUserById(id: string): Promise<UserData> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        return user as UserData;
    }

    async getUserByEmail(email: string): Promise<UserData> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        return user as UserData;
    }

    async getUserByUserName(username: string): Promise<UserData> {
        const user = await this.txHost.tx.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: "insensitive",
                },
            },
        });
        return user as UserData;
    }
    async banUser(id: string): Promise<UserData> {
        const user = await this.prisma.user.update({
            where: { id },
            data: { status: "banned" },
        });
        return user as UserData;
    }

    async unBanUser(id: string): Promise<UserData> {
        const user = await this.prisma.user.update({
            where: { id },
            data: { status: "active" },
        });
        return user as UserData;
    }
    async updateProfile(id: string, data: {avatar : string, oldPassword: string, newPassword : string}): Promise<UserData> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new Error("User not found");
        }
        let hashedPassword = user.password;
        if(data.oldPassword){
            const passwordValid = await bcrypt.compare(
                data.oldPassword,
                user.password as string
            );
            if (!passwordValid) {
                throw new Error("Password not match");
            }
            const saltOrRounds = 10;;
            hashedPassword = await bcrypt.hash(data.newPassword, saltOrRounds);
        }
        
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
        ...(data.avatar  && {avatar: data.avatar}),
                password: hashedPassword,
            },
        });
        return updatedUser as UserData;
    }
}
