export interface UserEntity {
  id: number;
  github_id: string;
  email: string;
  nickname: string;
  avatar: string;
}

export interface V2rayServerEntity {
  id: number;
  v2rayConfigJson: string;
  vmessUri: string;
  vmessUriRawJson: string;
  serverName: string;
}
