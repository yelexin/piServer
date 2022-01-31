import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('/logout')
export class LogoutController {
  @Get()
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        throw new InternalServerErrorException(err.message);
      }
      res.json({
        code: 200,
        message: '登出成功',
      });
    });
  }
}
