import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UserInSession, UserService } from '../../user';
import * as bcrypt from 'bcrypt';
import { UserLoginInput } from '../../user';

    @Injectable()
    export class AuthService {
      constructor(private readonly usersService: UserService) {}
      async validateUser(input : UserLoginInput): Promise<UserInSession | null> {
        const user = await this.usersService.getUserByUserName(input.username);
        if (!user) {
            throw new NotAcceptableException('could not find the user');
          }
        const passwordValid = await bcrypt.compare(input.password, user.password)
        if (user && passwordValid) {
          return {
            id : user.id,
            username : user.username,
            role : user.role,
          }
        }
        return null;
      }
    }