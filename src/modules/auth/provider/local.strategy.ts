import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../service';
import { UserInSession } from '../../user';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }
  async validate(username : string , password : string): Promise<UserInSession> {

    const input = {username , password, role : "user" }  ;  const user = await this.authService.validateUser(input);
    if (!user) {
      throw new UnauthorizedException( "Invalid credentials");
    }
    return user;
  }
}