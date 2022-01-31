import {
  IV2RayOutbound,
  IV2rayTransport,
  IVmessOutboundSettings,
  V2RayProtocol,
} from '../../types/v2ray';
import { OutboundSettings } from './SettingsFactory';
export type muxObject = {
  enabled: boolean;
  concurrency: number;
};

abstract class OutBoundItemBuilder {
  protected _tag: string;
  protected _protocol: V2RayProtocol;
  protected _settings: OutboundSettings;
  protected _streamSettings: IV2rayTransport;
  protected _mux: muxObject;
  abstract protocol(protocol: V2RayProtocol): void;
  abstract settings(outBoundSetting: OutboundSettings): void;
  abstract streamSettings(streamSettings: IV2rayTransport): void;
  mux(
    options: muxObject = {
      enabled: false,
      concurrency: 8,
    },
  ) {
    this._mux = options;
  }

  tag(tag: string) {
    this._tag = tag;
  }
  build(): IV2RayOutbound {
    return {
      mux: this._mux,
      // @ts-ignore
      protocol: this._protocol,
      streamSettings: this._streamSettings,
      tag: this._tag,
      settings: this._settings,
    };
  }
  getTag() {
    return this._tag;
  }
  getProtocol() {
    return this._protocol;
  }
  getSettings() {
    return this._settings;
  }
  getStreamSettings() {
    return this._streamSettings;
  }
  getMux() {
    return this._mux;
  }
}

export class VmessOutBoundItemBuilder extends OutBoundItemBuilder {
  protocol(protocol: V2RayProtocol): void {
    this._protocol = protocol;
  }
  streamSettings(streamSettings: IV2rayTransport) {
    this._streamSettings = streamSettings;
  }
  settings(settings: IVmessOutboundSettings) {
    this._settings = settings;
  }
}
