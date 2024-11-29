import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user";
import { AuthService } from "./service";
import { LocalStrategy } from "./strategy";

@Module({
    imports: [UserModule, PassportModule],
    providers: [AuthService, LocalStrategy],
  })
  export class AuthModule {}