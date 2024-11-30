import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user";
import { AuthService } from "./service";
import { LocalStrategy, SessionSerializer } from "./provider";

@Module({
    imports: [UserModule, PassportModule],
    providers: [AuthService, LocalStrategy, SessionSerializer],
  })
  export class AuthModule {}