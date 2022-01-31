import * as yaml from 'yaml';
import * as fs from 'fs';

const yamlConfig = fs.readFileSync('config.yaml', 'utf-8');

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
}

export const config: IConfig = yaml.parse(yamlConfig);
