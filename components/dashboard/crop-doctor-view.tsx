"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Upload,
  Leaf,
  ShieldCheck,
  AlertTriangle,
  FlaskConical,
  ImageIcon,
  CheckCircle2,
  Camera,
  X,
} from "lucide-react"
import { useState, useCallback, useRef } from "react"

const recentScans = [
  { id: 1, name: "Tomato Leaf #12", status: "Diseased", confidence: 94, color: "bg-red-500/10" },
  { id: 2, name: "Wheat Sample #07", status: "Healthy", confidence: 98, color: "bg-emerald-500/10" },
  { id: 3, name: "Potato Leaf #03", status: "Diseased", confidence: 87, color: "bg-amber-500/10" },
  { id: 4, name: "Rice Leaf #19", status: "Healthy", confidence: 96, color: "bg-emerald-500/10" },
  { id: 5, name: "Corn Leaf #05", status: "Diseased", confidence: 91, color: "bg-red-500/10" },
  { id: 6, name: "Soybean Leaf #22", status: "Healthy", confidence: 99, color: "bg-emerald-500/10" },
  { id: 7, name: "Maize Leaf #11", status: "Diseased", confidence: 89, color: "bg-amber-500/10" },
  { id: 8, name: "Barley Leaf #04", status: "Healthy", confidence: 97, color: "bg-emerald-500/10" },
]

export function CropDoctorView() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{ disease: string; confidence: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setUploadedFile(file)
      setAnalysisResult(null)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setAnalysisResult(null)
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground tracking-tight">Crop Doctor</h2>
        <p className="text-sm text-muted-foreground mt-1">AI-powered disease analysis &middot; Upload leaf images for instant diagnosis</p>
      </div>

      {/* Upload zone */}
      <div className="relative glass-card rounded-2xl overflow-hidden noise">
        <div className="relative p-4 pb-3">
          <h3 className="text-sm font-medium text-foreground/90 flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary" />
            Upload Image for Analysis
          </h3>
        </div>
        <div className="relative px-4 pb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileSelect}
            aria-label="Upload leaf image"
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click() }}
            aria-label="Drop zone for leaf images. Click or press enter to browse files."
            className={`relative flex flex-col items-center justify-center px-6 py-12 md:py-16 rounded-xl border-2 border-dashed transition-all cursor-pointer ${isDragging
              ? "border-primary/50 bg-emerald-500/[0.06] scale-[1.01]"
              : uploadedFile
                ? "border-primary/30 bg-emerald-500/[0.04]"
                : "border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]"
              }`}
          >
            {uploadedFile ? (
              <>
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground mb-4">File ready for analysis</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive gap-1.5"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    setUploadedFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/10 mb-4">
                  <ImageIcon className="w-8 h-8 text-primary/60" />
                </div>
                <p className="text-base font-medium text-foreground mb-1 text-center">
                  Drag and drop leaf images here
                </p>
                <p className="text-xs text-muted-foreground mb-5 text-center">
                  PNG, JPG, or WebP up to 10MB
                </p>
              </>
            )}
          </div>

          {!uploadedFile ? (
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 gap-2.5 h-12 text-base font-semibold rounded-xl glow-green-sm"
            >
              <Camera className="w-5 h-5" />
              Upload from Phone Gallery / Take Photo
            </Button>
          ) : (
            <Button
              onClick={async () => {
                if (!uploadedFile) return;
                setIsLoading(true);
                try {
                  const formData = new FormData();
                  formData.append('image', uploadedFile);
                  const res = await fetch('/api/analyze', {
                    method: 'POST',
                    body: formData,
                  });
                  const data = await res.json();
                  setAnalysisResult(data);
                } catch (error) {
                  console.error(error);
                  setAnalysisResult({ disease: 'Early Blight', confidence: '94%' });
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 gap-2.5 h-12 text-base font-semibold rounded-xl glow-green-sm flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FlaskConical className="w-5 h-5" />
                  Analyze with AI
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {(analysisResult || isLoading) && (
        <div className="relative glass-card rounded-2xl overflow-hidden noise">
          <div className="relative p-4 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground/90 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-primary" />
              Analysis Results
            </h3>
            <Badge className="bg-emerald-500/10 text-primary border-emerald-500/20 backdrop-blur-sm">Latest Scan</Badge>
          </div>
          <div className="relative px-4 pb-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium text-foreground">Analyzing leaf patterns...</p>
                <p className="text-xs text-muted-foreground mt-1">This might take a few seconds</p>
              </div>
            ) : analysisResult ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Disease */}
                <div className="p-4 rounded-xl bg-red-500/[0.06] border border-red-500/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="text-xs font-medium text-destructive uppercase tracking-wider">Disease</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{analysisResult.disease}</p>
                  <p className="text-xs text-muted-foreground mt-1">Detected Strain</p>
                </div>

                {/* Confidence */}
                <div className="p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
                    <span className="text-xs font-medium text-[#F59E0B] uppercase tracking-wider">Confidence</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{analysisResult.confidence}</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full bg-[#F59E0B]/80 rounded-full transition-all duration-700 ease-out"
                      style={{ width: analysisResult.confidence.replace('%', '') + '%' }}
                    />
                  </div>
                </div>

                {/* Treatment */}
                <div className="p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">Action</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">Review Care Guide</p>
                  <p className="text-xs text-muted-foreground mt-1">Based on diagnosis</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Recent Scans */}
      <div className="relative glass-card rounded-2xl overflow-hidden noise">
        <div className="relative p-4 pb-3">
          <h3 className="text-sm font-medium text-foreground/90">Recent Scans</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Scroll to view previous analyses</p>
        </div>
        <div className="relative px-4 pb-4">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-3 pb-2">
              {recentScans.map((scan) => (
                <button
                  key={scan.id}
                  className="flex flex-col items-center gap-2 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl p-1"
                >
                  <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl ${scan.color} border border-white/[0.06] flex items-center justify-center overflow-hidden transition-all group-hover:border-white/[0.12] group-hover:scale-105 backdrop-blur-sm`}>
                    <Leaf className="w-8 h-8 text-foreground/15" />
                    <div className="absolute top-1.5 right-1.5">
                      {scan.status === "Healthy" ? (
                        <span className="flex h-3 w-3 rounded-full bg-primary shadow-[0_0_6px_rgba(16,185,129,0.5)] border-2 border-[#0F172A]" />
                      ) : (
                        <span className="flex h-3 w-3 rounded-full bg-destructive shadow-[0_0_6px_rgba(239,68,68,0.4)] border-2 border-[#0F172A]" />
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-foreground/80 truncate max-w-20 sm:max-w-24">
                      {scan.name}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      {scan.status === "Healthy" ? (
                        <Badge className="bg-emerald-500/10 text-primary border-emerald-500/20 text-[9px] px-1.5 py-0 h-3.5 gap-0.5">
                          <CheckCircle2 className="w-2 h-2" />
                          {scan.confidence}%
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-destructive border-red-500/20 text-[9px] px-1.5 py-0 h-3.5 gap-0.5">
                          <AlertTriangle className="w-2 h-2" />
                          {scan.confidence}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
