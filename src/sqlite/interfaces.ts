import { VmessBody } from 'src/v2ray/interfaces';
import { IV2Ray } from 'types/v2ray';

export interface UserEntity {
  id: number;
  github_id: string;
  email: string;
  nickname: string;
  avatar: string;
}

export interface V2rayServerEntity {
  id: number;
  v2rayConfigJson: IV2Ray;
  vmessUri: string;
  vmessUriRawJson: VmessBody;
  serverName: string;
}
