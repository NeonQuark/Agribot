"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Battery,
  Cpu,
  Wifi,
  Thermometer,
  Activity,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

const initialLogs = [
  { time: "14:32:01", level: "OK", message: "System boot complete" },
  { time: "14:32:02", level: "OK", message: "Motor 1 initialized" },
  { time: "14:32:02", level: "OK", message: "Motor 2 initialized" },
  { time: "14:32:03", level: "INFO", message: "IMU calibration started" },
  { time: "14:32:05", level: "OK", message: "IMU calibration complete" },
  { time: "14:32:06", level: "INFO", message: "RTK GPS fix acquired" },
  { time: "14:32:07", level: "OK", message: "Camera module online" },
  { time: "14:32:08", level: "INFO", message: "WiFi signal strength: -42 dBm" },
  { time: "14:32:09", level: "OK", message: "Soil sensor probe ready" },
  { time: "14:32:10", level: "WARN", message: "Pi 5 temperature elevated: 65\u00b0C" },
  { time: "14:32:11", level: "INFO", message: "Battery at 78% \u2014 est. 2.4h remaining" },
  { time: "14:32:12", level: "OK", message: "ESP32 co-processor handshake complete" },
  { time: "14:32:13", level: "INFO", message: "WebRTC signaling server connected" },
  { time: "14:32:14", level: "OK", message: "All systems nominal \u2014 ready for operation" },
]

const newLogMessages = [
  { level: "INFO", message: "Telemetry packet sent (seq: 4821)" },
  { level: "OK", message: "Heartbeat acknowledged by base station" },
  { level: "INFO", message: "Soil moisture reading: 34.2%" },
  { level: "WARN", message: "Motor 2 current spike: 1.2A" },
  { level: "OK", message: "Motor 2 current normalized" },
  { level: "INFO", message: "GPS accuracy: 0.02m (RTK fixed)" },
  { level: "OK", message: "Image captured and queued for upload" },
  { level: "INFO", message: "Battery discharge rate: 0.8%/min" },
]

function getLogColor(level: string) {
  switch (level) {
    case "OK": return "text-primary"
    case "WARN": return "text-[#F59E0B]"
    case "ERROR": return "text-destructive"
    default: return "text-[#3B82F6]"
  }
}

export function DiagnosticsView() {
  const [logs, setLogs] = useState(initialLogs)
  const [batteryLevel, setBatteryLevel] = useState(78)
  const [cpuTemp, setCpuTemp] = useState(65)
  const [latency, setLatency] = useState(14)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      setCpuTemp(prev => {
        // Randomly fluctuate between 45 and 50
        const min = 45;
        const max = 50;
        const fluctuation = (Math.random() < 0.5 ? -1 : 1) * Math.random();
        let next = prev + fluctuation;
        if (next < min) next = min + Math.random();
        if (next > max) next = max - Math.random();
        return Number(next.toFixed(1));
      });

      setLatency(() => {
        // Randomly fluctuate between 12 and 28
        return Math.floor(Math.random() * (28 - 12 + 1)) + 12;
      });
    }, 2000);

    const batteryInterval = setInterval(() => {
      setBatteryLevel(prev => Math.max(0, prev - 1));
    }, 60000); // Drop 1% every minute

    return () => {
      clearInterval(telemetryInterval);
      clearInterval(batteryInterval);
    };
  }, []);

  useEffect(() => {
    let idx = 0
    const interval = setInterval(() => {
      const now = new Date()
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
      const newLog = newLogMessages[idx % newLogMessages.length]
      setLogs(prev => [...prev, { time, ...newLog }])
      idx++
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector("[data-slot='scroll-area-viewport']")
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [logs])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground tracking-tight">Fleet Diagnostics</h2>
        <p className="text-sm text-muted-foreground mt-1">Hardware health &middot; Real-time system logs</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Battery */}
        <div className="relative glass-card rounded-2xl overflow-hidden noise">
          <div className="relative p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
                  <Battery className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Battery Level</p>
                  <p className="text-2xl font-bold text-foreground transition-all duration-500">{batteryLevel}%</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/10 text-primary border-emerald-500/20 backdrop-blur-sm">Good</Badge>
            </div>
            <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-1000 ease-in-out" style={{ width: `${batteryLevel}%` }} />
            </div>
            <p className="text-xs text-muted-foreground/70 mt-2">Est. {(batteryLevel / 78 * 2.4).toFixed(1)} hours remaining</p>
          </div>
        </div>

        {/* Pi 5 Temp */}
        <div className="relative glass-card rounded-2xl overflow-hidden noise">
          <div className="relative p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center">
                  <Thermometer className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Pi 5 Temp</p>
                  <p className="text-2xl font-bold text-foreground transition-all duration-500">{cpuTemp}&deg;C</p>
                </div>
              </div>
              <Badge className="bg-amber-500/10 text-[#F59E0B] border-amber-500/20 backdrop-blur-sm">Warning</Badge>
            </div>
            <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full bg-[#F59E0B] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.3)] transition-all duration-1000 ease-in-out" style={{ width: `${(cpuTemp / 80) * 100}%` }} />
            </div>
            <p className="text-xs text-muted-foreground/70 mt-2">Throttle threshold: 80&deg;C</p>
          </div>
        </div>

        {/* ESP32 */}
        <div className="relative glass-card rounded-2xl overflow-hidden noise">
          <div className="relative p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">ESP32 Status</p>
                  <p className="text-2xl font-bold text-foreground">Online</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/10 text-primary border-emerald-500/20 gap-1.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Connected
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground/70">
              <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> UART 115200</span>
              <span className="flex items-center gap-1 transition-all duration-300"><Activity className="w-3 h-3" /> {latency}ms latency</span>
            </div>
          </div>
        </div>
      </div>

      {/* System logs */}
      <div className="relative glass-card rounded-2xl overflow-hidden noise">
        <div className="relative p-4 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground/90 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            System Logs
          </h3>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/[0.04] text-muted-foreground border-white/[0.08] font-mono text-[10px] backdrop-blur-sm">
              {logs.length} entries
            </Badge>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
            </span>
          </div>
        </div>
        <div className="relative p-0">
          <ScrollArea className="h-[360px]" ref={scrollRef}>
            <div className="px-4 py-2 font-mono text-xs">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-3 py-1.5 border-b border-white/[0.03] last:border-0">
                  <span className="text-muted-foreground/40 shrink-0 w-16">{log.time}</span>
                  <span className={`shrink-0 w-12 font-semibold ${getLogColor(log.level)}`}>
                    [{log.level}]
                  </span>
                  <span className="text-foreground/70">{log.message}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
