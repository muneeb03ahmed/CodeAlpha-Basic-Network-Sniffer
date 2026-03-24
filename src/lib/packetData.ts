export type Protocol = 'TCP' | 'UDP' | 'HTTP' | 'HTTPS' | 'DNS' | 'ICMP' | 'ARP';

export interface Packet {
  id: number;
  timestamp: string;
  sourceIP: string;
  destIP: string;
  protocol: Protocol;
  sourcePort: number;
  destPort: number;
  length: number;
  payload: string;
  flags?: string;
}

const IPs = [
  '192.168.1.5', '192.168.1.12', '10.0.0.1', '10.0.0.45',
  '172.16.0.100', '142.250.190.78', '151.101.1.140', '104.16.132.229',
  '93.184.216.34', '208.67.222.222', '1.1.1.1', '8.8.8.8',
  '52.85.132.99', '13.107.42.14', '185.199.108.153',
];

const payloads: Record<Protocol, string[]> = {
  TCP: [
    'SYN → SEQ=0 WIN=65535',
    'ACK → SEQ=1 ACK=1 WIN=65535',
    'PSH,ACK → Data transfer in progress',
    'FIN,ACK → Connection termination',
  ],
  UDP: [
    'DNS Query: A record for api.github.com',
    'DNS Response: 140.82.121.6',
    'NTP sync request',
    'DHCP Discover broadcast',
  ],
  HTTP: [
    'GET / HTTP/1.1 Host: example.com',
    'POST /api/login HTTP/1.1 Content-Type: application/json',
    'HTTP/1.1 200 OK Content-Length: 1256',
    'GET /assets/main.js HTTP/1.1',
  ],
  HTTPS: [
    'TLS ClientHello → TLSv1.3',
    'TLS ServerHello → cipher: TLS_AES_256_GCM_SHA384',
    'Application Data [encrypted] len=1420',
    'Change Cipher Spec',
  ],
  DNS: [
    'Standard query A www.google.com',
    'Standard query response CNAME → AAAA 2607:f8b0:4004',
    'Standard query A cdn.jsdelivr.net',
    'Standard query PTR 8.8.8.8.in-addr.arpa',
  ],
  ICMP: [
    'Echo (ping) request id=0x1234 seq=1',
    'Echo (ping) reply id=0x1234 seq=1 ttl=64',
    'Destination unreachable (Port unreachable)',
    'Time-to-live exceeded in transit',
  ],
  ARP: [
    'Who has 192.168.1.1? Tell 192.168.1.5',
    'Reply 192.168.1.1 is-at aa:bb:cc:dd:ee:ff',
    'Gratuitous ARP for 10.0.0.1',
    'Who has 10.0.0.254? Tell 10.0.0.45',
  ],
};

const protocols: Protocol[] = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'ICMP', 'ARP'];
const tcpFlags = ['SYN', 'ACK', 'PSH,ACK', 'FIN,ACK', 'SYN,ACK', 'RST'];

const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randPort = () => Math.floor(Math.random() * 65535) + 1;

let packetId = 0;

export function generatePacket(): Packet {
  const protocol = rand(protocols);
  const now = new Date();
  const ts = now.toISOString().slice(11, 23);

  return {
    id: ++packetId,
    timestamp: ts,
    sourceIP: rand(IPs),
    destIP: rand(IPs),
    protocol,
    sourcePort: protocol === 'HTTP' ? 80 : protocol === 'HTTPS' ? 443 : protocol === 'DNS' ? 53 : randPort(),
    destPort: randPort(),
    length: Math.floor(Math.random() * 1400) + 60,
    payload: rand(payloads[protocol]),
    flags: protocol === 'TCP' ? rand(tcpFlags) : undefined,
  };
}

export function getProtocolColor(protocol: Protocol): string {
  const map: Record<Protocol, string> = {
    TCP: 'text-primary',
    UDP: 'text-secondary',
    HTTP: 'text-warning',
    HTTPS: 'text-primary',
    DNS: 'text-accent',
    ICMP: 'text-destructive',
    ARP: 'text-muted-foreground',
  };
  return map[protocol];
}

export function getProtocolBg(protocol: Protocol): string {
  const map: Record<Protocol, string> = {
    TCP: 'bg-primary/15 text-primary border-primary/30',
    UDP: 'bg-secondary/15 text-secondary border-secondary/30',
    HTTP: 'bg-warning/15 text-warning border-warning/30',
    HTTPS: 'bg-primary/15 text-primary border-primary/30',
    DNS: 'bg-accent/15 text-accent border-accent/30',
    ICMP: 'bg-destructive/15 text-destructive border-destructive/30',
    ARP: 'bg-muted text-muted-foreground border-muted-foreground/30',
  };
  return map[protocol];
}
