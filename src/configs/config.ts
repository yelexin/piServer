import * as yaml from 'yaml';
import * as fs from 'fs';

let yamlConfig = null;

if (fs.existsSync('config.yaml')) {
  yamlConfig = fs.readFileSync('config.yaml', 'utf-8');
} else if (fs.existsSync('/usr/local/etc/piServer/config.yaml')) {
  yamlConfig = fs.readFileSync('/usr/local/etc/piServer/config.yaml', 'utf-8');
} else if (fs.existsSync('/etc/piServer/config.yaml')) {
  yamlConfig = fs.readFileSync('/etc/piServer/config.yaml', 'utf-8');
} else {
  throw new Error(
    '找不到配置文件，请将配置文件放到项目目录或 /usr/local/etc/piServer/config.yaml 或 /etc/piServer/config.yaml',
  );
}

interface IConfig {
  serverOrigin: string;
  // v2ray 可执行文件路径
  v2rayExecPath: string;
  // v2ray 配置文件路径
  v2rayConfigPath: string;
  // v2ray 订阅 url
  subscriptionUrl: string;
  githubClientId: string;
  githubClientSecret: string;
  httpProxy?: {
    host: string;
    port: number;
  };
  session: {
    secret: string;
    dbPath: string;
  };
  // sqlite 数据库文件地址
  db: {
    path: string;
  };
}

export const config: IConfig = yaml.parse(yamlConfig);
