import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { config } from '../configs/config';
import { V2rayService } from './v2rayService';

@Injectable()
export class UpdateV2raySubsriptionCronService {
  private readonly logger = new Logger(UpdateV2raySubsriptionCronService.name);
  private readonly V2RAY_SUBSCRIPTION_URL = config.subscriptionUrl;

  constructor(private readonly v2rayService: V2rayService) {}
  // 每月 1 号凌晨 2 点 15 分更新 v2ray 订阅
  @Cron('* 2 15 1 * *')
  // @Cron('50 * * * * *')
  async handleCron() {
    this.logger.debug(`从 ${this.V2RAY_SUBSCRIPTION_URL} 更新 v2ray 订阅`);
    await this.v2rayService.updateV2raySubscription();
    this.logger.debug(`更新 v2ray 订阅成功`);
  }
}
