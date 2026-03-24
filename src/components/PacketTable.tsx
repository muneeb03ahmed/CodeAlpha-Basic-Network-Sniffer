import { getProtocolBg, type Packet } from '@/lib/packetData';

interface PacketTableProps {
  packets: Packet[];
  onSelect: (packet: Packet) => void;
  selectedId: number | null;
}

export function PacketTable({ packets, onSelect, selectedId }: PacketTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden flex-1 flex flex-col min-h-0">
      <div className="grid grid-cols-[60px_100px_140px_140px_80px_80px_80px_1fr] gap-2 px-4 py-2 bg-muted/50 text-xs text-muted-foreground uppercase tracking-wider font-mono border-b border-border">
        <span>#</span>
        <span>Time</span>
        <span>Source</span>
        <span>Destination</span>
        <span>Proto</span>
        <span>Port</span>
        <span>Length</span>
        <span>Info</span>
      </div>
      <div className="overflow-y-auto flex-1 scrollbar-thin">
        {packets.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm font-mono">
            No packets captured yet. Press Start to begin...
          </div>
        )}
        {packets.map((pkt) => (
          <div
            key={pkt.id}
            onClick={() => onSelect(pkt)}
            className={`grid grid-cols-[60px_100px_140px_140px_80px_80px_80px_1fr] gap-2 px-4 py-1.5 text-xs font-mono cursor-pointer border-b border-border/30 transition-colors hover:bg-primary/5 animate-slide-in ${
              selectedId === pkt.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''
            }`}
          >
            <span className="text-muted-foreground">{pkt.id}</span>
            <span className="text-muted-foreground">{pkt.timestamp}</span>
            <span className="text-foreground">{pkt.sourceIP}</span>
            <span className="text-foreground">{pkt.destIP}</span>
            <span>
              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] border ${getProtocolBg(pkt.protocol)}`}>
                {pkt.protocol}
              </span>
            </span>
            <span className="text-muted-foreground">{pkt.destPort}</span>
            <span className="text-muted-foreground">{pkt.length}</span>
            <span className="text-card-foreground truncate">{pkt.payload}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
