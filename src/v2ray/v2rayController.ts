import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { V2rayService } from './v2rayService';
import * as fs from 'fs';
import { config } from '../configs/config';
import { execSync } from 'child_process';
import { AuthGuard } from 'src/common/guards/auth.guard';

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
  // todo 鉴权
  async updateV2raySubscription() {
    await this.v2rayService.updateV2raySubscription();
    return {
      code: 200,
      message: '更新订阅成功',
    };
  }

  @Get('/servers')
  // todo 鉴权
  // @UseGuards(AuthGuard)
  async getServers() {
    const servers = await this.v2rayService.getServers();
    return {
      code: 200,
      message: '获取服务器成功',
      data: servers,
    };
  }

  @Post('/enableServer')
  // todo 鉴权
  // todo Validation Pipe
  @UseGuards(AuthGuard)
  async enableServer(@Body('id') id: number) {
    if(!id) {
      throw new Error('未指定 id')
    }
    const serverConfigText = await this.v2rayService.findConfigTextById(id);
    // 替换 v2ray 的 config.json
    fs.writeFileSync(config.v2rayConfigPath, serverConfigText);
    // 重启 v2ray
    execSync('sudo systemctl restart v2ray');
    return {
      code: 200,
      message: '成功更新 v2ray 配置文件',
    };
  }
}
