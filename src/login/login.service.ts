import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import * as uuid from 'uuid';
import * as qs from 'querystring';
import * as tunnel from 'tunnel';
import { config } from '../configs/config';

@Injectable()
export class LoginService {
  constructor(private readonly httpService: HttpService) {}
  private agent = config.httpProxy
    ? tunnel.httpsOverHttp({
        proxy: {
          host: config.httpProxy.host,
          port: config.httpProxy.port,
        },
      })
    : undefined;

  // 拼接 github 登录 url
  buildGithubLoginUrl() {
    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.append('client_id', config.githubClientId);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append(
      'redirect_uri',
      `${config.serverOrigin}/login/github/callback`,
    );
    const state = uuid.v4();
    url.searchParams.append('state', state);
    return url;
  }
  async githubCodeToToken(code: string) {
    const resp = await lastValueFrom(
      this.httpService.post<IGithubCodeToTokenResponse>(
        'https://github.com/login/oauth/access_token',
        qs.stringify({
          code,
          client_id: config.githubClientId,
          client_secret: config.githubClientSecret,
        }),
        {
          headers: {
            Accept: 'application/json',
          },
          httpsAgent: this.agent,
        },
      ),
    );
    return resp.data.access_token;
  }
  async githubTokenToUserInfo(token: string) {
    const resp = await lastValueFrom(
      this.httpService.get<IGithubUserInfoResponse>(
        'https://api.github.com/user',
        {
          headers: {
            Authorization: `token ${token}`,
          },
          httpsAgent: this.agent,
        },
      ),
    );
    return resp.data;
  }
}
