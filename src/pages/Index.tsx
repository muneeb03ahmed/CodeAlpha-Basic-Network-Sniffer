import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, Trash2, Download, Terminal, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatsPanel } from '@/components/StatsPanel';
import { PacketTable } from '@/components/PacketTable';
import { PacketDetail } from '@/components/PacketDetail';
import { generatePacket, type Packet, type Protocol } from '@/lib/packetData';

const PROTOCOLS: Protocol[] = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'ICMP', 'ARP'];

const Index = () => {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);
  const [filterText, setFilterText] = useState('');
  const [activeProtocols, setActiveProtocols] = useState<Set<Protocol>>(new Set(PROTOCOLS));
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const toggleCapture = useCallback(() => {
    setIsCapturing(prev => !prev);
  }, []);

  useEffect(() => {
    if (isCapturing) {
      intervalRef.current = setInterval(() => {
        setPackets(prev => {
          const newPackets = [...prev, generatePacket()];
          return newPackets.slice(-500); // keep last 500
        });
      }, 150 + Math.random() * 200);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isCapturing]);

  const filteredPackets = packets.filter(p => {
    if (!activeProtocols.has(p.protocol)) return false;
    if (!filterText) return true;
    const search = filterText.toLowerCase();
    return (
      p.sourceIP.includes(search) ||
      p.destIP.includes(search) ||
      p.protocol.toLowerCase().includes(search) ||
      p.payload.toLowerCase().includes(search)
    );
  });

  const toggleProtocol = (proto: Protocol) => {
    setActiveProtocols(prev => {
      const next = new Set(prev);
      if (next.has(proto)) next.delete(proto);
      else next.add(proto);
      return next;
    });
  };

  const clearPackets = () => {
    setPackets([]);
    setSelectedPacket(null);
  };

  const exportPackets = () => {
    const csv = [
      'ID,Timestamp,Source,Destination,Protocol,Port,Length,Payload',
      ...filteredPackets.map(p =>
        `${p.id},${p.timestamp},${p.sourceIP},${p.destIP},${p.protocol},${p.destPort},${p.length},"${p.payload}"`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'packet_capture.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col grid-bg scanline">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            <span className="text-primary neon-text">Net</span>Sniffer
          </h1>
          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">v1.0</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={toggleCapture}
            size="sm"
            variant={isCapturing ? 'destructive' : 'default'}
            className="gap-1.5 font-mono text-xs"
          >
            {isCapturing ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isCapturing ? 'Stop' : 'Start'}
          </Button>
          <Button onClick={clearPackets} size="sm" variant="outline" className="gap-1.5 font-mono text-xs">
            <Trash2 className="w-3 h-3" />
            Clear
          </Button>
          <Button onClick={exportPackets} size="sm" variant="outline" className="gap-1.5 font-mono text-xs">
            <Download className="w-3 h-3" />
            Export
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col p-4 gap-4 min-h-0">
        <StatsPanel packets={packets} isCapturing={isCapturing} />

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Filter by IP, protocol, payload..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-9 h-8 text-xs font-mono bg-muted border-border"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {PROTOCOLS.map((proto) => (
              <button
                key={proto}
                onClick={() => toggleProtocol(proto)}
                className={`px-2 py-1 rounded text-[10px] font-mono border transition-colors ${
                  activeProtocols.has(proto)
                    ? 'bg-primary/15 text-primary border-primary/40'
                    : 'bg-muted text-muted-foreground border-border'
                }`}
              >
                {proto}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 gap-0 min-h-0">
          <PacketTable
            packets={filteredPackets}
            onSelect={setSelectedPacket}
            selectedId={selectedPacket?.id ?? null}
          />
          <PacketDetail
            packet={selectedPacket}
            onClose={() => setSelectedPacket(null)}
          />
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground px-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isCapturing ? 'bg-primary animate-pulse-neon' : 'bg-muted-foreground'}`} />
              {isCapturing ? 'CAPTURING' : 'IDLE'}
            </span>
            <span>Interface: eth0 (simulated)</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Showing {filteredPackets.length} / {packets.length} packets</span>
            <span>Buffer: {((packets.length / 500) * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
