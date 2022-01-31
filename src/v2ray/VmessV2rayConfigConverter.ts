import {
  IStrategy,
  IV2Ray,
  IVmessSecurity,
  LogLevel,
  V2RayProtocol,
} from '../../types/v2ray';
import { VmessBody } from './interfaces';
import { VmessOutBoundItemBuilder } from './OutBoundBuilder';
import { VmessSettingsFactory } from './SettingsFactory';
import { WsStreamSettingsFactory } from './StreamSettingsFactory';

export class VmessV2rayConfigConverter {
  private vmessBody: VmessBody;
  private localListenAddress: string = '127.0.0.1';
  private localSocks5Port: number = 1080;
  private localHttpPort: number = 1087;
  setVmessBody(vmessBody: VmessBody) {
    this.vmessBody = vmessBody;
  }
  setLocalListenAddress(addr: string) {
    this.localListenAddress = addr;
  }
  setLocalSocks5Port(port: number) {
    this.localSocks5Port = port;
  }
  setLocalHttpPort(port: number) {
    this.localHttpPort = port;
  }
  convert(): IV2Ray {
    // todo 应该根据 vmess 里的 net 动态选择一个 streamSettings 的工厂，这就是抽象工厂的应用吧？
    const streamSettingsFactory = new WsStreamSettingsFactory();
    const streamSettings = streamSettingsFactory.buildStreamSettings(
      this.vmessBody.path,
      this.vmessBody.host,
      this.vmessBody.tls,
    );
    const settingsFactor = new VmessSettingsFactory();
    const settings = settingsFactor.buildSettings(
      this.vmessBody.add,
      this.vmessBody.port,
      [
        {
          id: this.vmessBody.id,
          alterId: this.vmessBody.aid,
          security: IVmessSecurity.AUTO,
          level: 0,
        },
      ],
    );
    const outBoundItemBuilder = new VmessOutBoundItemBuilder();
    outBoundItemBuilder.protocol(V2RayProtocol.VMESS);
    outBoundItemBuilder.tag('proxy')
    outBoundItemBuilder.streamSettings(streamSettings);
    outBoundItemBuilder.settings(settings);
    const outBoundItem = outBoundItemBuilder.build();
    return {
      log: {
        error: '',
        loglevel: LogLevel.info,
        access: '',
      },
      inbounds: [
        {
          listen: this.localListenAddress,
          protocol: V2RayProtocol.SOCKS,
          settings: {
            udp: false,
            auth: 'noauth',
          },
          port: this.localSocks5Port,
        },
        {
          listen: this.localListenAddress,
          protocol: V2RayProtocol.HTTP,
          settings: {
            timeout: 360,
          },
          port: this.localHttpPort,
        },
      ],
      outbounds: [outBoundItem],
      routing: {
        domainStrategy: IStrategy.AsIs,
        rules: [],
      },
    };
  }
}
