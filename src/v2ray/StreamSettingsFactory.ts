import { IV2rayStreamSetting, IV2rayTransport } from '../../types/v2ray';

abstract class StreamSettingsFactory {
  abstract buildStreamSettings(...args: any): IV2rayTransport;
  getStreamSettings(...args: any) {
    const streamSettings = this.buildStreamSettings(...args);
    return streamSettings;
  }
}

export class WsStreamSettingsFactory extends StreamSettingsFactory {
  buildStreamSettings(
    path: string,
    host: string,
    security: 'tls' | 'none' = 'none',
  ): IV2rayStreamSetting {
    return {
      network: 'ws',
      wsSettings: {
        path,
        headers: {
          host,
        },
      },
      security,
    };
  }
}
