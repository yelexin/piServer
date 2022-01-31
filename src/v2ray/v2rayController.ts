import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { V2rayService } from './v2rayService';
import * as fs from 'fs';
import * as path from 'path';
import { VmessBody } from './interfaces';
import { config } from '../configs/config';
import { exec, execSync } from 'child_process';

@Controller('/api/v1/v2ray')
export class V2rayController {
  constructor(private readonly v2rayService: V2rayService) {}

  @Get('/vmess2json')
  convertVmessUriToV2rayJson(
    // 完整 vmess uri
    @Query('vmessUri') vmessUri: string,
    // 指定 inbound socks5 端口
    @Query('socks5Port') socks5Port: number,
    // 指定 inbound http 端口
    @Query('httpPort') httpPort: number,
    // 指定 inbound ip
    @Query('ip') ip: string,
  ) {
    const v2rayJson = this.v2rayService.vmessUri2V2rayJsonConfig(
      vmessUri,
      socks5Port,
      httpPort,
      ip,
    );
    return v2rayJson;
  }

  @Post('/updateSubscription')
  async updateV2raySubscription() {
    await this.v2rayService.updateV2raySubscription();
    return {
      code: 200,
      message: '更新订阅成功',
    };
  }

  @Get('/servers')
  async getServers() {
    const dirs = fs.readdirSync('v2rayConfigJsons');
    dirs.sort();
    const newest = dirs[dirs.length - 1];
    const configs = fs.readdirSync(path.resolve('v2rayConfigJsons', newest));
    const rawConfigs = configs.filter((v) => v.includes('raw'));
    const servers = [];
    for (let i = 0; i < rawConfigs.length; i++) {
      const rawConfigTxt = fs.readFileSync(
        path.resolve('v2rayConfigJsons', newest, rawConfigs[i]),
        'utf-8',
      );
      const rawConfigJson: VmessBody = JSON.parse(rawConfigTxt);
      servers.push({
        id: i,
        remark: rawConfigJson.ps,
        host: rawConfigJson.host,
      });
    }
    return {
      code: 200,
      message: '获取服务器成功',
      data: servers,
    };
  }

  @Post('/enableServer')
  async enableServer(@Body('id') id: number) {
    if(!id) {
      throw new Error('未指定 id')
    }
    const dirs = fs.readdirSync('v2rayConfigJsons');
    dirs.sort();
    const newest = dirs[dirs.length - 1];
    const configTxt = fs.readFileSync(
      path.resolve('v2rayConfigJsons', newest, `config_${id}.json`),
      'utf-8',
    );
    fs.writeFileSync(config.v2rayConfigPath, configTxt);
    execSync('sudo systemctl restart v2ray');
    return {
      code: 200,
      message: '成功更新 v2ray 配置文件',
    };
  }
}
