import { Inject, Injectable } from '@nestjs/common';
import { Database } from '../sqlite/db';
import { UserEntity, V2rayServerEntity } from '../sqlite/interfaces';

@Injectable()
export class V2rayProvider {
  constructor(@Inject('DATABASE') private readonly db: Database) {}
  async insert(v2rayEntity: V2rayServerEntity) {
    
  }
}
