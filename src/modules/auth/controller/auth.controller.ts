
import { GoogleOAuthGuard, LocalAuthGuard } from '../guard';
import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from 'express';

@ApiTags('OAuth')
@Controller('oauth')
export class AuthController {
  constructor() {}

  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req : Request ) {}

  @Get('/google-callback')
  @UseGuards(LocalAuthGuard)
  googleAuthRedirect(@Req() req : Request, @Res() res : Response) {
    
    res.redirect('/shop');
  }
}