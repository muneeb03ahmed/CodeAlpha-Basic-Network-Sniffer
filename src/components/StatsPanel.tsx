import { Activity, Shield, Wifi, AlertTriangle } from 'lucide-react';
import type { Packet, Protocol } from '@/lib/packetData';

interface StatsPanelProps {
  packets: Packet[];
  isCapturing: boolean;
}

export function StatsPanel({ packets, isCapturing }: StatsPanelProps) {
  const protocolCounts = packets.reduce<Record<string, number>>((acc, p) => {
    acc[p.protocol] = (acc[p.protocol] || 0) + 1;
    return acc;
  }, {});

  const totalBytes = packets.reduce((sum, p) => sum + p.length, 0);
  const uniqueIPs = new Set(packets.flatMap(p => [p.sourceIP, p.destIP])).size;

  const stats = [
    {
      icon: Activity,
      label: 'Packets Captured',
      value: packets.length.toLocaleString(),
      sub: isCapturing ? 'Live capture active' : 'Capture paused',
      accent: 'text-primary',
    },
    {
      icon: Wifi,
      label: 'Data Volume',
      value: totalBytes > 1024 * 1024
        ? `${(totalBytes / 1024 / 1024).toFixed(1)} MB`
        : `${(totalBytes / 1024).toFixed(1)} KB`,
      sub: `${uniqueIPs} unique hosts`,
      accent: 'text-secondary',
    },
    {
      icon: Shield,
      label: 'Protocols',
      value: Object.keys(protocolCounts).length.toString(),
      sub: Object.entries(protocolCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([k, v]) => `${k}: ${v}`)
        .join(' · '),
      accent: 'text-accent',
    },
    {
      icon: AlertTriangle,
      label: 'Alerts',
      value: packets.filter(p => p.protocol === 'ICMP' || p.flags === 'RST').length.toString(),
      sub: 'ICMP + RST flags',
      accent: 'text-destructive',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg border border-border bg-card p-4 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-2">
            <s.icon className={`w-4 h-4 ${s.accent}`} />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
          </div>
          <div className={`text-2xl font-bold font-mono ${s.accent} neon-text`}>{s.value}</div>
          <div className="text-xs text-muted-foreground mt-1 truncate">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
