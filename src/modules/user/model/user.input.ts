import { ApiProperty, OmitType } from "@nestjs/swagger";
import { UserData } from "./user.data";

export class UserInput extends OmitType(UserData, ['id'] as const) {}

export class UserLoginInput extends OmitType(UserData, ['id', 'name', 'email', 'status', 'createdAt', 'avatar'] as const) {}


export class UpdateInforInput {
    @ApiProperty({description: 'The avatar of the user', example: 'https://www.google.com'})
    avatar: string;

    @ApiProperty({description: 'The name of the user', example: 'John Doe'})
    name: string;

    @ApiProperty({description: 'The old password of the user', example: 'password'})
    oldPassword: string;

    @ApiProperty({description: 'The new password of the user', example: 'password'})
    newPassword: string;
}