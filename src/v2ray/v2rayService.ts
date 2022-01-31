import { Injectable } from '@nestjs/common';
import { VmessBody } from './interfaces';
import { IV2Ray } from '../../types/v2ray';
import { VmessV2rayConfigConverter } from './VmessV2rayConfigConverter';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { config } from '../configs/config';
import { V2rayProvider } from './v2rayProvider';

@Injectable()
export class V2rayService {
  private readonly V2RAY_SUBSCRIPTION_URL = config.subscriptionUrl;

  constructor(
    private readonly httpService: HttpService,
    private readonly v2rayProvider: V2rayProvider,
  ) {}
  decodeVmessUri(vmessUri: string): VmessBody {
    if (!vmessUri.startsWith('vmess://')) {
      throw new Error('该 URI scheme 不是 vmess');
    }
    const base64Info = vmessUri.slice(8); // 去掉 vmess://
    const data = Buffer.from(base64Info, 'base64').toString();
    let vmessBody: VmessBody = null;
    try {
      vmessBody = JSON.parse(data);
    } catch (err) {
      throw new Error('vmess URI 中包含了错误的信息');
    }
    return vmessBody;
  }
  vmessUri2V2rayJsonConfig(
    vmessUri: string,
    localSocks5Port: number = 1080,
    localHttpPort: number = 1087,
    localListenAddress: string = '127.0.0.1',
  ) {
    const vmessBody = this.decodeVmessUri(vmessUri);
    const converter = new VmessV2rayConfigConverter();
    converter.setVmessBody(vmessBody);
    converter.setLocalSocks5Port(localSocks5Port);
    converter.setLocalHttpPort(localHttpPort);
    converter.setLocalListenAddress(localListenAddress);
    const v2rayConfig: IV2Ray = converter.convert();
    return v2rayConfig;
  }
  async getServers() {
    const servers = await this.v2rayProvider.findAll();
    return servers;
  }
  async findConfigTextById(id: number) {
    const server = await this.v2rayProvider.findById(id);
    return server.v2rayConfigJson;
  }
  async updateV2raySubscription() {
    // 获取订阅
    const resp = await lastValueFrom(
      this.httpService.get(this.V2RAY_SUBSCRIPTION_URL),
    );
    const base64Txt: string = resp.data;
    const vmessUriStr = Buffer.from(base64Txt, 'base64').toString();
    const vmessUris = vmessUriStr.split('\n');
    // 丢弃最后一个，是一个空串
    if (!vmessUris[vmessUris.length - 1]) {
      vmessUris.pop();
    }
    // vmess 转 v2ray config
    const v2rayJsons = vmessUris.map((item) => {
      return this.vmessUri2V2rayJsonConfig(item);
    });
    // 直接解析 vmess uri 得到的 JSON
    const rawJsons: VmessBody[] = [];
    vmessUris.forEach((item) => {
      rawJsons.push(this.decodeVmessUri(item));
    });
    // 删除所有旧的 servers
    await this.v2rayProvider.deleteAll()
    for (let i = 0; i < v2rayJsons.length; i++) {
      await this.v2rayProvider.insert({
        v2rayConfigJson: JSON.stringify(v2rayJsons[i]),
        vmessUri: vmessUris[i],
        vmessUriRawJson: JSON.stringify(rawJsons[i]),
        serverName: rawJsons[i].ps
      })
    }
  }
}
