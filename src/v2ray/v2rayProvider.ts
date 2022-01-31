import { Inject, Injectable } from '@nestjs/common';
import { Database } from '../sqlite/db';
import { V2rayServerEntity } from '../sqlite/interfaces';

@Injectable()
export class V2rayProvider {
  constructor(@Inject('DATABASE') private readonly db: Database) {}
  async insert(v2rayEntity: Partial<V2rayServerEntity>) {
    const { v2rayConfigJson, vmessUri, vmessUriRawJson, serverName } =
      v2rayEntity;
    const result = await this.db.run(
      'INSERT INTO v2ray_servers (v2ray_config_json,vmess_uri,vmess_uri_raw_json,server_name,created_at,updated_at) VALUES (?,?,?,?,?,?)',
      v2rayConfigJson,
      vmessUri,
      vmessUriRawJson,
      serverName,
      Date.now(),
      Date.now(),
    );
    return result;
  }
  async findAll() {
    const servers: V2rayServerEntity[] = await this.db.all(
      'select * from v2ray_servers;',
    );
    return servers;
  }
  async findById(id: number) {
    const server: V2rayServerEntity = await this.db.get(
      'select * from v2ray_servers where id = ?;',
      id,
    );
    return server;
  }
}
