import { Inject, Injectable } from '@nestjs/common';
import { Database } from '../sqlite/db';
import { UserEntity } from '../sqlite/interfaces';

@Injectable()
export class UserProvider {
  constructor(@Inject('DATABASE') private readonly db: Database) {}
  // 暂时只会通过 github 的 Id 查找用户
  async findByGithubId(githubId: string): Promise<UserEntity> {
    const res = await this.db.get(
      'select * from users where github_id = ?;',
      githubId,
    );
    if (!res) {
      throw new Error(`没有找到 github_id 为 ${githubId} 的用户`);
    }
    return res;
  }
  async findById(id: number): Promise<UserEntity> {
    const res = await this.db.get('select * from users where id = ?;', id);
    if (!res) {
      throw new Error(`没有找到 id 为 ${id} 的用户`);
    }
    return res;
  }
}
