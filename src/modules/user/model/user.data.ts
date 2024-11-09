import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";

export class UserData {
    @ApiProperty({description: 'The id of the user', example: 1})
    id : number ;

    @ApiProperty({description: 'The email of the user', example: 'user@gmail.com'})
    email : string ;

    @ApiProperty({description: 'The name of the user', example: 'User 1'})
    name : string ;

    @ApiProperty({description: 'The password of the user', example: 'password'})
    password : string ;

    @ApiProperty({description: 'The role of the user', example: 'user'})
    role : string ;

    constructor (user: User) {
        this.id = user.id;
        this.email = user.email;
        this.name = user.name;
        this.password = user.password;
        this.role = user.role;
    }
}