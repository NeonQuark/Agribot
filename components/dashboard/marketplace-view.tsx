"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Store,
  Plus,
  Phone,
  Wheat,
  Carrot,
  Apple,
} from "lucide-react"

const listings = [
  { id: 1, crop: "Organic Wheat", vendor: "Singh Farms", quantity: "500 kg", price: "\u20b924/kg", icon: Wheat, available: true },
  { id: 2, crop: "Basmati Rice", vendor: "Patel Agro", quantity: "200 kg", price: "\u20b945/kg", icon: Wheat, available: true },
  { id: 3, crop: "Fresh Carrots", vendor: "Green Valley Co.", quantity: "100 kg", price: "\u20b918/kg", icon: Carrot, available: true },
  { id: 4, crop: "Red Apples", vendor: "Himalayan Orchards", quantity: "300 kg", price: "\u20b9120/kg", icon: Apple, available: false },
  { id: 5, crop: "Soybean", vendor: "MP Grains Ltd.", quantity: "1000 kg", price: "\u20b952/kg", icon: Wheat, available: true },
  { id: 6, crop: "Mustard Seeds", vendor: "Rajput Seeds", quantity: "150 kg", price: "\u20b995/kg", icon: Wheat, available: true },
  { id: 7, crop: "Pearl Millet", vendor: "Arid Zone Farms", quantity: "800 kg", price: "\u20b922/kg", icon: Wheat, available: true },
]

const stats = [
  { label: "Active Listings", value: "42", change: "+5 today" },
  { label: "Total Vendors", value: "18", change: "3 new" },
  { label: "Avg. Price/kg", value: "\u20b954", change: "+2.1%" },
  { label: "Transactions", value: "156", change: "This week" },
]

export function MarketplaceView() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">Agritech Hub</h2>
          <p className="text-sm text-muted-foreground mt-1">Local marketplace &middot; Browse and post crop listings</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 w-full sm:w-auto rounded-xl glow-green-sm">
          <Plus className="w-4 h-4" />
          Post New Listing
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="relative glass-card rounded-2xl overflow-hidden noise">
            <div className="relative p-4">
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              <p className="text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
              <p className="text-xs text-primary mt-1">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="relative glass-card rounded-2xl overflow-hidden noise">
        <div className="relative p-4 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground/90 flex items-center gap-2">
            <Store className="w-4 h-4 text-primary" />
            Marketplace Listings
          </h3>
          <Badge className="bg-white/[0.04] text-muted-foreground border-white/[0.08] backdrop-blur-sm">
            {listings.length} listings
          </Badge>
        </div>
        <div className="relative p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-muted-foreground">Crop</TableHead>
                <TableHead className="text-muted-foreground">Vendor</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Quantity</TableHead>
                <TableHead className="text-muted-foreground">Price</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id} className="border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/10 flex items-center justify-center shrink-0">
                        <listing.icon className="w-4 h-4 text-primary/60" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{listing.crop}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{listing.vendor}</TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{listing.quantity}</TableCell>
                  <TableCell className="text-sm font-medium text-foreground">{listing.price}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {listing.available ? (
                      <Badge className="bg-emerald-500/10 text-primary border-emerald-500/20 text-[10px]">Available</Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-destructive border-red-500/20 text-[10px]">Sold Out</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="border-white/[0.08] bg-white/[0.03] text-foreground hover:bg-white/[0.06] gap-1.5 h-8 rounded-lg">
                      <Phone className="w-3 h-3" />
                      <span className="hidden sm:inline">Contact</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
