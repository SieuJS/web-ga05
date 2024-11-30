import { ApiProperty, OmitType } from "@nestjs/swagger";
import { User } from "@prisma/client";
import {
    validate,
    Length,
    IsEmail,
    IsNotEmpty,
  } from 'class-validator';

export class UserData {
    @ApiProperty({description: 'The id of the user', example: 1})
    id : string ;

    @ApiProperty({description: 'The email of the user', example: 'user@gmail.com'})
    @IsEmail()
    email : string ;

    @ApiProperty({description: 'The username of user.username the user', example: 'User1'})
    @Length(6)
    username :  string ;

    @Length(6)
    @ApiProperty({description: 'The name of the user', example: 'User 1'})
    name : string ;

    @Length(6)
    @ApiProperty({description: 'The password of the user', example: 'password'})
    password : string ;

    @IsNotEmpty()
    @ApiProperty({description: 'The role of the user', example: 'user'})
    role : string ;

    constructor (user: User) {
        this.id = user.id;
        this.email = user.email as string;
        this.name = user.name as string;
        this.username = user.username  as string;
        this.password = user.password as string;
        this.role = user.role as string;
        validate(this).then(errors => {
            if (errors.length > 0) {
                throw new Error(`Validation failed. errors: ${errors}`);
            }
        });
    }
}

export class UserInSession extends OmitType(UserData, ['password','name', 'email', 'id'] as const) {}