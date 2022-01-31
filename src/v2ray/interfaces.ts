export interface VmessBody {
  host: string;
  path: string;
  tls: 'tls' | 'none';
  add: string;
  port: number;
  aid: number;
  net: string;
  type: string;
  v: string;
  ps: string;
  id: string;
}
// {
//   host: 'hk174.y7k.xyz',
//   path: '/hk174',
//   tls: 'tls',
//   add: 'hk174.y7k.xyz',
//   port: 443,
//   aid: 1,
//   net: 'ws',
//   type: 'none',
//   v: '2',
//   ps: '香港15 V2Ray',
//   id: '2d18659c-6ad5-31a0-b51f-0b5bfb03d12d'
// }
