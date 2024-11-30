import { PipeTransform, ValidationPipe } from "@nestjs/common";
import { UserInput } from "../model";

export class UserInputPipe implements PipeTransform {
  transform(value: UserInput) {

    return {
        ...value,
        username : value.username.toLowerCase()
    }
  }
}

export class UserSignupValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      validationError: { target: false },
    });
  }
}