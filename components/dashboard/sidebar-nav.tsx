"use client"

import { cn } from "@/lib/utils"
import {
  Gamepad2,
  Route,
  Microscope,
  Store,
  Activity,
  Menu,
  Leaf,
  X,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export type ViewType = "teleop" | "patrol" | "crop-doctor" | "marketplace" | "community" | "diagnostics"

const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: "teleop", label: "Tele-Op", icon: Gamepad2 },
  { id: "patrol", label: "Auto-Patrol", icon: Route },
  { id: "crop-doctor", label: "Crop Doctor", icon: Microscope },
  { id: "marketplace", label: "Agritech Hub", icon: Store },
  { id: "community", label: "Community", icon: MessageCircle },
  { id: "diagnostics", label: "Fleet Diagnostics", icon: Activity },
]

interface SidebarNavProps {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
}

function NavContent({ activeView, onViewChange, onItemClick }: SidebarNavProps & { onItemClick?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/[0.06]">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 glow-green-sm">
          <Leaf className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground tracking-tight">AgriRover</h1>
          <p className="text-[11px] text-muted-foreground">Command Center</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4">
        <p className="px-3 mb-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">Navigation</p>
        <ul className="flex flex-col gap-1" role="tablist" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const isActive = activeView === item.id
            return (
              <li key={item.id}>
                <button
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    onViewChange(item.id)
                    onItemClick?.()
                  }}
                  className={cn(
                    "relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-emerald-500/10 border border-emerald-500/15" />
                  )}
                  <item.icon className="relative w-4.5 h-4.5 shrink-0" />
                  <span className="relative">{item.label}</span>
                  {isActive && (
                    <span className="relative ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Status card */}
      <div className="px-3 pb-4">
        <div className="relative px-3 py-3 rounded-xl glass-subtle overflow-hidden">
          <div className="noise" />
          <div className="relative flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
            </span>
            <span className="text-xs font-medium text-foreground">Rover Online</span>
          </div>
          <p className="relative text-[11px] text-muted-foreground">AGRI-RV-001 &middot; Field 7</p>
        </div>
      </div>
    </div>
  )
}

export function SidebarNav({ activeView, onViewChange }: SidebarNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 h-screen glass-sidebar sticky top-0">
        <NavContent activeView={activeView} onViewChange={onViewChange} />
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center gap-3 px-4 py-3 glass-strong">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-white/[0.06]" aria-label="Open navigation">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 glass-sidebar [&>button]:hidden">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex items-center justify-end px-4 pt-4">
              <button onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="Close navigation">
                <X className="w-5 h-5" />
              </button>
            </div>
            <NavContent
              activeView={activeView}
              onViewChange={onViewChange}
              onItemClick={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">AgriRover</span>
        </div>
        <span className="ml-auto text-xs text-muted-foreground capitalize">{activeView.replace("-", " ")}</span>
      </header>
    </>
  )
}
