import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user";
import { AuthService } from "./service";
import { LocalStrategy, SessionSerializer } from "./provider";
import { AuthController } from "./controller";
import { GoogleStrategy } from "./provider/google.strategy";

@Module({
    imports: [UserModule, PassportModule],
    providers: [AuthService, LocalStrategy, SessionSerializer, GoogleStrategy],
    controllers : [AuthController]
  })
  export class AuthModule {}