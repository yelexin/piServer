import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  // todo 鉴权
  async test(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return user;
  }
}
