import {
  IBlackholeOutboundSettings,
  IDNSOutboundSettings,
  IFreedomOutboundSettings,
  IHttpOutboundSettings,
  IMTProtoOutboundSettings,
  IShadowsocksOutboundSettings,
  ISocksOutboundSettings,
  ITrojanOutboundSettings,
  IV2RayOutbound,
  IV2rayTransport,
  IVLESSOutboundSettings,
  IVmessOutboundSettings,
  IVmessServerAccountObject,
} from '../../types/v2ray';

export type OutboundSettings =
  | ITrojanOutboundSettings
  | IVLESSOutboundSettings
  | IVmessOutboundSettings
  | ISocksOutboundSettings
  | IShadowsocksOutboundSettings
  | IMTProtoOutboundSettings
  | IHttpOutboundSettings
  | IFreedomOutboundSettings
  | IDNSOutboundSettings
  | IBlackholeOutboundSettings;

abstract class SettingsFactory {
  abstract buildSettings(...args: any): OutboundSettings;

  getSettings(...args: any) {
    const settings = this.buildSettings(args);
    return settings;
  }
}

export class VmessSettingsFactory extends SettingsFactory {
  buildSettings(
    v2rayServerAddress: string,
    v2rayServerPort: number,
    users: IVmessServerAccountObject[],
  ): IVmessOutboundSettings {
    return {
      vnext: [
        {
          address: v2rayServerAddress,
          port: v2rayServerPort,
          users,
        },
      ],
    };
  }
}
