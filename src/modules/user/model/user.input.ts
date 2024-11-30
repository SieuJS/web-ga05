import { OmitType } from "@nestjs/swagger";
import { UserData } from "./user.data";

export class UserInput extends OmitType(UserData, ['id'] as const) {}

export class UserLoginInput extends OmitType(UserData, ['id', 'name', 'email'] as const) {}