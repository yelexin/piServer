import {
  Controller,
  Get,
  Param,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserService } from './user.service';

@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  @UseGuards(AuthGuard)
  async test(@Req() req: Request, @Param('id') id: number) {
    if (Number(id) !== Number(req.session?.userId)) {
      throw new UnauthorizedException('无权获取该用户信息');
    }
    const user = await this.userService.findById(Number(id));
    return user;
  }
}
