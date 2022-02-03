import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { LoginService } from './login.service';

@Controller('/login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly userService: UserService,
  ) {}
  @Get('/github/init')
  async initGithubLogin(
    @Req() req: Request,
    @Res() res: Response,
    @Query('returnTo') returnTo: string,
  ) {
    const loginUrl = this.loginService.buildGithubLoginUrl();
    req.session.interaction = {
      state: loginUrl.searchParams.get('state'),
      returnTo,
    };
    res.redirect(loginUrl.toString());
  }
  @Get('/github/callback')
  async githubLoginCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    if (req.session.interaction?.state !== state) {
      throw new ForbiddenException('state 参数不正确');
    }
    const token = await this.loginService.githubCodeToToken(code);
    const userInfo = await this.loginService.githubTokenToUserInfo(token);
    // find user by githubId
    const user = await this.userService.findByGithubId(userInfo.id.toString());
    req.session.userId = user.id;
    res.redirect(req.session.interaction.returnTo || '/');
  }
  @Get('/checkSession')
  async checkSession(@Req() req: Request) {
    if (req.session.userId) {
      return {
        code: 200,
        message: '已登录',
        data: {
          id: req.session.userId,
        },
      };
    }
    throw new UnauthorizedException('未登录');
  }
}
