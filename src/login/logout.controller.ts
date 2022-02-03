import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('/logout')
export class LogoutController {
  @Get()
  async logout(
    @Req() req: Request,
    @Res() res: Response,
    @Query('returnTo') returnTo: string,
  ) {
    req.session.destroy((err) => {
      if (err) {
        throw new InternalServerErrorException(err.message);
      }
      if (returnTo) {
        res.redirect(returnTo);
      } else {
        res.json({
          code: 200,
          message: '登出成功',
        });
      }
    });
  }
}
