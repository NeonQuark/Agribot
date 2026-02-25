"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Play,
  Navigation,
  Clock,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const waypoints = [
  { id: 1, name: "Waypoint Alpha", lat: "28.6139\u00b0N", lng: "77.2090\u00b0E", type: "Start" },
  { id: 2, name: "Waypoint Bravo", lat: "28.6145\u00b0N", lng: "77.2102\u00b0E", type: "Scan" },
  { id: 3, name: "Waypoint Charlie", lat: "28.6152\u00b0N", lng: "77.2078\u00b0E", type: "End" },
]

export function PatrolView() {
  const [isDeploying, setIsDeploying] = useState(false)
  const [isPatrolling, setIsPatrolling] = useState(false)

  const handleStartPatrol = async () => {
    setIsDeploying(true)
    toast("Initializing autonomous sequence... Deploying rover.")
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsDeploying(false)
    setIsPatrolling(true)
    toast.success("Rover deployed. Live tracking active.")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground tracking-tight">Auto-Patrol</h2>
        <p className="text-sm text-muted-foreground mt-1">Configure waypoints &middot; Launch autonomous missions</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Map */}
        <div className="xl:col-span-2 relative glass-card rounded-2xl overflow-hidden noise">
          <div className="relative p-4 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground/90 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary" />
              Patrol Map
            </h3>
            <Badge className="bg-white/[0.04] text-muted-foreground border-white/[0.08] gap-1 backdrop-blur-sm">
              <MapPin className="w-3 h-3" />
              3 Waypoints
            </Badge>
          </div>
          <div className="relative px-4 pb-4">
            <div className="relative aspect-[16/10] bg-black/40 rounded-xl overflow-hidden border border-white/[0.04]">
              {/* Realistic Map Background */}
              <img
                src="https://images.unsplash.com/photo-1542385002-282e7af12662?auto=format&fit=crop&q=80&w=1600"
                alt="Satellite Farm Map"
                className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20" />
              {/* Grid */}
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: `linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)`,
                backgroundSize: "30px 30px",
              }} />
              {/* Route SVG */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 250" fill="none">
                <path d="M100,180 Q200,60 300,120" stroke="rgba(16,185,129,0.3)" strokeWidth="2" strokeDasharray="6 4" />
                <circle cx="100" cy="180" r="6" fill="#10B981" opacity="0.8" />
                <circle cx="100" cy="180" r="14" fill="none" stroke="#10B981" opacity="0.15" strokeWidth="1" />
                <circle cx="200" cy="100" r="5" fill="#3B82F6" opacity="0.8" />
                <circle cx="200" cy="100" r="13" fill="none" stroke="#3B82F6" opacity="0.15" strokeWidth="1" />
                <circle cx="300" cy="120" r="6" fill="#EF4444" opacity="0.8" />
                <circle cx="300" cy="120" r="14" fill="none" stroke="#EF4444" opacity="0.15" strokeWidth="1" />
                <text x="100" y="202" fill="rgba(148,163,184,0.5)" fontSize="10" textAnchor="middle" fontFamily="monospace">Alpha</text>
                <text x="200" y="86" fill="rgba(148,163,184,0.5)" fontSize="10" textAnchor="middle" fontFamily="monospace">Bravo</text>
                <text x="300" y="142" fill="rgba(148,163,184,0.5)" fontSize="10" textAnchor="middle" fontFamily="monospace">Charlie</text>

                {/* Live tracking marker */}
                {isPatrolling && (
                  <g>
                    <circle r="6" fill="#0EA5E9" className="animate-pulse" />
                    <circle r="14" fill="none" stroke="#0EA5E9" strokeWidth="2" className="animate-ping" />
                    <animateMotion dur="15s" repeatCount="indefinite" path="M100,180 Q200,60 300,120" />
                  </g>
                )}
              </svg>
              <div className="absolute top-3 left-3 flex flex-col items-start font-mono">
                {isPatrolling ? (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse mb-1 rounded-sm backdrop-blur-md">LIVE TRACKING</Badge>
                ) : (
                  <Badge className="bg-black/50 text-primary/70 border-primary/20 mb-1 rounded-sm backdrop-blur-md">PATROL MAP</Badge>
                )}
                <Badge className="bg-black/50 text-muted-foreground border-white/10 rounded-sm backdrop-blur-md text-[10px]">ETA: {isPatrolling ? "11 min" : "12 min"}</Badge>
              </div>
              <div className="absolute top-3 right-3 text-xs font-mono text-muted-foreground/30">
                <p>ZOOM: 15x</p>
              </div>
            </div>
          </div>
        </div>

        {/* Waypoint panel */}
        <div className="flex flex-col gap-6">
          <div className="relative glass-card rounded-2xl overflow-hidden noise">
            <div className="relative p-4 pb-3">
              <h3 className="text-sm font-medium text-foreground/90">Mission Waypoints</h3>
              <p className="text-xs text-muted-foreground mt-0.5">GPS coordinates for autonomous route</p>
            </div>
            <div className="relative px-4 pb-4 flex flex-col gap-3">
              {waypoints.map((wp) => (
                <div
                  key={wp.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] group hover:border-white/[0.1] transition-colors"
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${wp.type === "Start" ? "bg-emerald-500/10 text-primary" :
                      wp.type === "End" ? "bg-red-500/10 text-destructive" :
                        "bg-blue-500/10 text-[#3B82F6]"
                    }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{wp.name}</span>
                      <Badge className="bg-white/[0.04] text-muted-foreground border-white/[0.08] text-[10px] px-1.5 py-0 h-4">{wp.type}</Badge>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground/70 mt-0.5">{wp.lat}, {wp.lng}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive" aria-label={`Remove ${wp.name}`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="relative glass-card rounded-2xl overflow-hidden noise">
            <div className="relative p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Est. Duration
                </span>
                <span className="text-foreground font-medium">~12 min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Total Distance
                </span>
                <span className="text-foreground font-medium">0.8 km</span>
              </div>
              <Button
                onClick={handleStartPatrol}
                disabled={isDeploying || isPatrolling}
                className={`w-full mt-2 gap-2 h-12 text-base font-semibold rounded-xl transition-all ${isPatrolling
                    ? "bg-blue-500/10 text-blue-500 border border-blue-500/30 backdrop-blur-sm"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 glow-green"
                  }`}
              >
                {isDeploying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Deploying Rover...
                  </>
                ) : isPatrolling ? (
                  <>
                    <Navigation className="w-5 h-5 animate-pulse" />
                    Patrol in Progress
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Autonomous Patrol
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
