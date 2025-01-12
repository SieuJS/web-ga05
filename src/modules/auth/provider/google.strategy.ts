import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { UserInput, UserInSession } from '../../user';
import { AuthService } from '../service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService : AuthService,
   
  ) {
    super({
      clientID: "540405177648-0tcg4ln5cq08l8nu797d52bt7n5i8ged.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: 'http://localhost:3000/api/v1/oauth/google-callback',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<UserInSession> {
    const { name, emails, photos } = profile;
    const user : UserInput= {
      email: emails[0].value,
      name: name.givenName + ' ' + name.familyName,
      avatar: photos[0].value,
      role: 'user',
      status: 'active',
      password: 'password',
      username: emails[0].value,
      createdAt: new Date(),
    };
    const userInSession = await this.authService.validateGoogleUser(user);
    return userInSession as UserInSession;
    done(null, {user : userInSession});
  }
}