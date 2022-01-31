import { Injectable } from '@nestjs/common';
import { UserProvider } from './user.provider';

@Injectable()
export class UserService {
  constructor(private readonly userProvider: UserProvider){}
  // 暂时只会通过 github 的 Id 查找用户
  async findByGithubId(githubId: string) {
    const user = await this.userProvider.findByGithubId(githubId);
    return user;
  }
  async findById(id: number) {
    const user = await this.userProvider.findById(id);
    return user;
  }
}
