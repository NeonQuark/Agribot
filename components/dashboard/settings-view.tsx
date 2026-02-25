"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Globe, CheckCircle2, Phone, Shield, Cpu } from "lucide-react"
import { toast } from "sonner"

const languages = [
    { value: "en", label: "English" },
    { value: "hi", label: "हिन्दी (Hindi)" },
    { value: "ta", label: "தமிழ் (Tamil)" },
    { value: "te", label: "తెలుగు (Telugu)" },
    { value: "ml", label: "മലയാളം (Malayalam)" },
    { value: "kn", label: "ಕನ್ನಡ (Kannada)" },
    { value: "mr", label: "मराठी (Marathi)" },
    { value: "gu", label: "ગુજરાતી (Gujarati)" },
    { value: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
    { value: "bn", label: "বাংলা (Bengali)" },
    { value: "or", label: "ଓଡ଼ିଆ (Odia)" },
    { value: "sa", label: "संस्कृतम् (Sanskrit)" },
    { value: "as", label: "অসমীয়া (Assamese)" },
]

export function SettingsView() {
    const [language, setLanguage] = useState("en")

    const handleLanguageChange = (value: string) => {
        setLanguage(value)
        const selectedLang = languages.find(l => l.value === value)?.label
        toast.success(`Language updated to ${selectedLang}`)
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold text-foreground tracking-tight">Settings</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage app preferences &middot; System information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Language & Localisation */}
                <div className="relative glass-card rounded-2xl overflow-hidden noise">
                    <div className="relative p-4 pb-3 flex items-center justify-between border-b border-white/[0.04]">
                        <h3 className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary" />
                            Language & Localization
                        </h3>
                    </div>
                    <div className="relative p-5 flex flex-col gap-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">App Language</label>
                            <Select value={language} onValueChange={handleLanguageChange}>
                                <SelectTrigger className="w-full bg-black/40 border-white/[0.08] text-foreground h-11 rounded-xl">
                                    <SelectValue placeholder="Select a language" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-950 border-white/[0.08]">
                                    {languages.map((lang) => (
                                        <SelectItem key={lang.value} value={lang.value} className="focus:bg-white/[0.06] cursor-pointer">
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-[11px] text-muted-foreground mt-2">
                                AgriRover supports multiple indigenous languages to assist farmers across diverse regions. UI will reload upon changing.
                            </p>
                        </div>

                        <div className="pt-2 border-t border-white/[0.04]">
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Measurement Units</label>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 h-9 rounded-lg">Metric</Button>
                                <Button variant="outline" className="flex-1 bg-white/[0.03] text-muted-foreground border-white/[0.08] hover:bg-white/[0.06] h-9 rounded-lg">Imperial</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="relative glass-card rounded-2xl overflow-hidden noise">
                    <div className="relative p-4 pb-3 flex items-center justify-between border-b border-white/[0.04]">
                        <h3 className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-emerald-500" />
                            System Information
                        </h3>
                    </div>
                    <div className="relative p-5">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">App Version</span>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-mono">v1.4.2-beta</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Framework</span>
                                <span className="text-sm font-medium text-foreground">Next.js 14 / React 18</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Build Number</span>
                                <span className="text-sm font-mono text-foreground font-medium">8a2f9c4</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">API Server</span>
                                <span className="text-sm font-medium text-foreground">v2.1 (Online)</span>
                            </div>
                            <div className="pt-2 mt-1 border-t border-white/[0.04] flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Update Available</span>
                                <Button size="sm" variant="outline" className="h-7 text-xs bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]">Check</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support */}
                <div className="relative glass-card rounded-2xl overflow-hidden noise md:col-span-2 xl:col-span-1">
                    <div className="relative p-4 pb-3 flex items-center justify-between border-b border-white/[0.04]">
                        <h3 className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-amber-500" />
                            Support & Legal
                        </h3>
                    </div>
                    <div className="relative p-5 flex flex-col gap-3">
                        <Button variant="outline" className="w-full justify-between bg-white/[0.03] text-foreground border-white/[0.08] hover:bg-white/[0.06] h-11 rounded-xl">
                            Contact Farmer Support
                            <Phone className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="outline" className="w-full justify-between bg-white/[0.03] text-foreground border-white/[0.08] hover:bg-white/[0.06] h-11 rounded-xl">
                            Terms of Service
                            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="outline" className="w-full justify-between bg-white/[0.03] text-foreground border-white/[0.08] hover:bg-white/[0.06] h-11 rounded-xl">
                            Privacy Policy
                            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
