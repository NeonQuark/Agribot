"use client"

import { useState } from "react"
import { SidebarNav, type ViewType } from "@/components/dashboard/sidebar-nav"
import { TeleOpView } from "@/components/dashboard/teleop-view"
import { PatrolView } from "@/components/dashboard/patrol-view"
import { CropDoctorView } from "@/components/dashboard/crop-doctor-view"
import { MarketplaceView } from "@/components/dashboard/marketplace-view"
import { CommunityView } from "@/components/dashboard/community-view"
import { DiagnosticsView } from "@/components/dashboard/diagnostics-view"
import { SettingsView } from "@/components/dashboard/settings-view"

const views: Record<ViewType, React.ComponentType> = {
  teleop: TeleOpView,
  patrol: PatrolView,
  "crop-doctor": CropDoctorView,
  marketplace: MarketplaceView,
  community: CommunityView,
  diagnostics: DiagnosticsView,
  settings: SettingsView,
}

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<ViewType>("teleop")
  const ActiveComponent = views[activeView]

  return (
    <div className="flex min-h-screen mesh-bg">
      <SidebarNav activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 min-w-0">
        <div className="p-4 md:p-6 lg:p-8 max-w-[1400px]">
          <ActiveComponent />
        </div>
      </main>
    </div>
  )
}
