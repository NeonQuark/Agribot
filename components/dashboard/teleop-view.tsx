"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  FlaskConical,
  Camera,
  Video,
  Signal,
  Maximize,
  Minimize,
  Power,
  PowerOff,
} from "lucide-react"
import { useCallback, useEffect, useState, useRef } from "react"
import { toast } from "sonner"

const directionKeys: Record<string, string> = {
  w: "forward",
  a: "left",
  s: "backward",
  d: "right",
  ArrowUp: "forward",
  ArrowDown: "backward",
  ArrowLeft: "left",
  ArrowRight: "right",
}

export function TeleOpView() {
  const [activeDirection, setActiveDirection] = useState<string | null>(null)
  const [roverStatus, setRoverStatus] = useState("Idle")
  const [isCameraOn, setIsCameraOn] = useState(true)

  const handleDirectionChange = useCallback((dir: string | null) => {
    setActiveDirection(dir)
    if (dir) {
      if (dir === "forward") {
        setRoverStatus("Moving Forward")
      } else {
        setRoverStatus(`Moving ${dir.charAt(0).toUpperCase() + dir.slice(1)}`)
      }
      toast("Telemetry: Executing move command")
    } else {
      setRoverStatus("Idle")
    }
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const dir = directionKeys[e.key]
    if (dir) {
      e.preventDefault()
      if (activeDirection !== dir) {
        handleDirectionChange(dir)
      }
    }
  }, [activeDirection, handleDirectionChange])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const dir = directionKeys[e.key]
    if (dir) {
      handleDirectionChange(null)
    }
  }, [handleDirectionChange])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground tracking-tight">Tele-Operation</h2>
        <p className="text-sm text-muted-foreground mt-1">Manual drive controls &middot; Real-time camera feed</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Camera feed */}
        <div className="xl:col-span-2 relative glass-card rounded-2xl overflow-hidden noise">
          <div className="relative p-4 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                Camera Feed
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsCameraOn(!isCameraOn)
                  toast(`Camera turned ${!isCameraOn ? "ON" : "OFF"}`)
                }}
                className={`h-7 px-2.5 text-xs gap-1.5 border hover:bg-white/[0.04] transition-all backdrop-blur-sm ${isCameraOn
                    ? "bg-red-500/10 text-destructive border-red-500/20 hover:text-red-400"
                    : "bg-emerald-500/10 text-primary border-emerald-500/20 hover:text-emerald-400"
                  }`}
              >
                {isCameraOn ? <PowerOff className="w-3 h-3" /> : <Power className="w-3 h-3" />}
                {isCameraOn ? "Turn Off" : "Turn On"}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
                Rover Status: {roverStatus}
              </Badge>
              <Badge className="bg-emerald-500/10 text-primary border-emerald-500/20 gap-1.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Live WebRTC
              </Badge>
              <Badge className="bg-white/[0.04] text-muted-foreground border-white/[0.08] gap-1 backdrop-blur-sm">
                <Signal className="w-3 h-3" />
                24ms
              </Badge>
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="relative aspect-video bg-black/40 rounded-xl overflow-hidden flex items-center justify-center border border-white/[0.04]">
              {/* Camera Video Feed */}
              {isCameraOn ? (
                <>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                  />
                  {/* Grid overlay */}
                  <div className="absolute inset-0 opacity-[0.06]" style={{
                    backgroundImage: `linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                  }} />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-muted-foreground">
                  <Video className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm font-mono tracking-widest uppercase opacity-50">Camera Offline</p>
                </div>
              )}
              {/* Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 border border-primary/30 rounded-full" />
                <div className="absolute w-6 h-[1px] bg-primary/30" />
                <div className="absolute h-6 w-[1px] bg-primary/30" />
              </div>
              {/* HUD overlay */}
              <div className="absolute top-3 left-3 text-xs font-mono text-primary/50">
                <p>CAM_01 &middot; 1080p@30fps</p>
                <p>FOV: 120&deg;</p>
              </div>
              <div className="absolute bottom-3 right-3 text-xs font-mono text-primary/50 text-right">
                <p>LAT: 28.6139&deg;N</p>
                <p>LNG: 77.2090&deg;E</p>
              </div>
              <div className="absolute bottom-3 left-3">
                <Badge className="bg-red-500/15 text-destructive border-red-500/20 text-xs font-mono backdrop-blur-sm">
                  REC
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Controls column */}
        <div className="flex flex-col gap-6">
          {/* D-pad */}
          <div className="relative glass-card rounded-2xl overflow-hidden noise">
            <div className="relative p-4 pb-3">
              <h3 className="text-sm font-medium text-foreground/90">Motor Control</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Use WASD or arrow keys</p>
            </div>
            <div className="relative px-4 pb-4">
              <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto">
                <div />
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-14 w-full rounded-xl border-white/[0.08] bg-white/[0.03] transition-all ${activeDirection === "forward"
                    ? "bg-primary/20 text-primary border-primary/30 glow-green-sm"
                    : "text-foreground/80 hover:bg-white/[0.06]"
                    }`}
                  onMouseDown={() => handleDirectionChange("forward")}
                  onMouseUp={() => handleDirectionChange(null)}
                  onMouseLeave={() => activeDirection === "forward" && handleDirectionChange(null)}
                  onTouchStart={(e: React.TouchEvent) => { e.preventDefault(); handleDirectionChange("forward"); }}
                  onTouchEnd={(e: React.TouchEvent) => { e.preventDefault(); handleDirectionChange(null); }}
                  aria-label="Forward"
                >
                  <ArrowUp className="w-5 h-5" />
                </Button>
                <div />
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-14 w-full rounded-xl border-white/[0.08] bg-white/[0.03] transition-all ${activeDirection === "left"
                    ? "bg-primary/20 text-primary border-primary/30 glow-green-sm"
                    : "text-foreground/80 hover:bg-white/[0.06]"
                    }`}
                  onMouseDown={() => handleDirectionChange("left")}
                  onMouseUp={() => handleDirectionChange(null)}
                  onMouseLeave={() => activeDirection === "left" && handleDirectionChange(null)}
                  onTouchStart={(e: React.TouchEvent) => { e.preventDefault(); handleDirectionChange("left"); }}
                  onTouchEnd={(e: React.TouchEvent) => { e.preventDefault(); handleDirectionChange(null); }}
                  aria-label="Left"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-14 w-full rounded-xl border-white/[0.08] bg-white/[0.03] transition-all ${activeDirection === "backward"
                    ? "bg-primary/20 text-primary border-primary/30 glow-green-sm"
                    : "text-foreground/80 hover:bg-white/[0.06]"
                    }`}
                  onMouseDown={() => handleDirectionChange("backward")}
                  onMouseUp={() => handleDirectionChange(null)}
                  onMouseLeave={() => activeDirection === "backward" && handleDirectionChange(null)}
                  onTouchStart={(e: React.TouchEvent) => { e.preventDefault(); handleDirectionChange("backward"); }}
                  onTouchEnd={(e: React.TouchEvent) => { e.preventDefault(); handleDirectionChange(null); }}
                  aria-label="Backward"
                >
                  <ArrowDown className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-14 w-full rounded-xl border-white/[0.08] bg-white/[0.03] transition-all ${activeDirection === "right"
                    ? "bg-primary/20 text-primary border-primary/30 glow-green-sm"
                    : "text-foreground/80 hover:bg-white/[0.06]"
                    }`}
                  onMouseDown={() => handleDirectionChange("right")}
                  onMouseUp={() => handleDirectionChange(null)}
                  onMouseLeave={() => activeDirection === "right" && handleDirectionChange(null)}
                  onTouchStart={(e: React.TouchEvent) => { e.preventDefault(); handleDirectionChange("right"); }}
                  onTouchEnd={(e: React.TouchEvent) => { e.preventDefault(); handleDirectionChange(null); }}
                  aria-label="Right"
                >
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto mt-1">
                <div />
                <p className="text-center text-[10px] font-mono text-muted-foreground/50">W / &uarr;</p>
                <div />
                <p className="text-center text-[10px] font-mono text-muted-foreground/50">A / &larr;</p>
                <p className="text-center text-[10px] font-mono text-muted-foreground/50">S / &darr;</p>
                <p className="text-center text-[10px] font-mono text-muted-foreground/50">D / &rarr;</p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="relative glass-card rounded-2xl overflow-hidden noise">
            <div className="relative p-4 pb-3">
              <h3 className="text-sm font-medium text-foreground/90">Quick Actions</h3>
            </div>
            <div className="relative px-4 pb-4 flex flex-col gap-3">
              <Button className="w-full bg-emerald-500/10 text-primary border border-emerald-500/15 hover:bg-emerald-500/15 gap-2 rounded-xl backdrop-blur-sm" variant="outline" onClick={() => toast("Command sent: Deploying soil sensor")}>
                <FlaskConical className="w-4 h-4" />
                Deploy Soil Sensor
              </Button>
            </div>
          </div>

          {/* Robotic Arm */}
          <div className="relative glass-card rounded-2xl overflow-hidden noise">
            <div className="relative p-4 pb-3">
              <h3 className="text-sm font-medium text-foreground/90">Robotic Arm (Camera)</h3>
            </div>
            <div className="relative px-4 pb-4 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Button className="w-full bg-emerald-500/10 text-primary border border-emerald-500/15 hover:bg-emerald-500/15 gap-2 rounded-xl backdrop-blur-sm" variant="outline" onClick={() => toast("Arm Status: Extending...")}>
                  <Maximize className="w-4 h-4" />
                  Extend
                </Button>
                <Button className="w-full bg-emerald-500/10 text-primary border border-emerald-500/15 hover:bg-emerald-500/15 gap-2 rounded-xl backdrop-blur-sm" variant="outline" onClick={() => toast("Arm Status: Retracting...")}>
                  <Minimize className="w-4 h-4" />
                  Retract
                </Button>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-xl glow-green-sm" onClick={() => { toast("Camera: High-res photo captured"); setRoverStatus("Capturing Photo...") }}>
                <Camera className="w-4 h-4" />
                Capture Photo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
