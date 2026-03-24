import { X } from 'lucide-react';
import { getProtocolBg, type Packet } from '@/lib/packetData';

interface PacketDetailProps {
  packet: Packet | null;
  onClose: () => void;
}

export function PacketDetail({ packet, onClose }: PacketDetailProps) {
  if (!packet) return null;

  const hexDump = Array.from({ length: 4 }, (_, row) =>
    Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join(' ')
  );

  const fields = [
    ['Packet #', packet.id],
    ['Timestamp', packet.timestamp],
    ['Source IP', packet.sourceIP],
    ['Source Port', packet.sourcePort],
    ['Destination IP', packet.destIP],
    ['Destination Port', packet.destPort],
    ['Protocol', packet.protocol],
    ['Length', `${packet.length} bytes`],
    ...(packet.flags ? [['TCP Flags', packet.flags]] : []),
  ] as const;

  return (
    <div className="w-80 border-l border-border bg-card p-4 overflow-y-auto animate-slide-in flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Packet Detail</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className={`inline-flex self-start px-2 py-1 rounded text-xs border font-mono ${getProtocolBg(packet.protocol)}`}>
        {packet.protocol}
      </div>

      <div className="space-y-2">
        {fields.map(([label, value]) => (
          <div key={label} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-mono text-foreground">{value}</span>
          </div>
        ))}
      </div>

      <div>
        <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Payload</h4>
        <div className="bg-muted rounded p-2 text-xs font-mono text-primary break-all">
          {packet.payload}
        </div>
      </div>

      <div>
        <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Hex Dump</h4>
        <div className="bg-muted rounded p-2 text-[10px] font-mono text-muted-foreground leading-relaxed">
          {hexDump.map((line, i) => (
            <div key={i}>
              <span className="text-primary/50">{(i * 16).toString(16).padStart(4, '0')}</span>{' '}
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
