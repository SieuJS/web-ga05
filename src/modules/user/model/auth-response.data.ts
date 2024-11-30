import { ApiProperty } from '@nestjs/swagger';
import { UserInSession } from './user.data';

export class AuthResponse  extends UserInSession {
    @ApiProperty({description: "Bearer token", example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI5MzUwNjIyLCJleHAiOjE2MjkzNTA5MjJ9.7Z6`})
    token: string;
}