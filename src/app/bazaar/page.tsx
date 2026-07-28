"use client"

import { motion } from "framer-motion"
import { Search, Star, Zap, Globe, DollarSign, ArrowRight, ExternalLink, Shield, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const endpoints = [
  {
    name: "OpenAI GPT-4o",
    provider: "OpenAI",
    address: "0x1A2B...3C4D",
    network: "eip155:8453",
    costPerCall: "$0.02",
    latency: "320ms",
    rating: 4.9,
    category: "LLM",
    verified: true,
    description: "Flagship large language model for reasoning, code generation, and analysis tasks.",
  },
  {
    name: "SerpAPI Web Search",
    provider: "SerpAPI",
    address: "0x5B4A...3C2D",
    network: "eip155:8453",
    costPerCall: "$0.01",
    latency: "180ms",
    rating: 4.7,
    category: "Search",
    verified: true,
    description: "Real-time search engine results with structured JSON output for web, images, and news.",
  },
  {
    name: "CoinGecko Pro",
    provider: "CoinGecko",
    address: "0x8D9A...3E6B",
    network: "eip155:10",
    costPerCall: "$0.05",
    latency: "95ms",
    rating: 4.8,
    category: "Finance",
    verified: true,
    description: "Comprehensive cryptocurrency market data including prices, volumes, and historical OHLCV.",
  },
  {
    name: "Perplexity Sonar",
    provider: "Perplexity AI",
    address: "0x2D5A...7B3C",
    network: "eip155:8453",
    costPerCall: "$0.03",
    latency: "450ms",
    rating: 4.6,
    category: "Search",
    verified: true,
    description: "AI-powered search engine delivering cited, synthesized answers from web sources.",
  },
  {
    name: "Bloomberg Terminal API",
    provider: "Bloomberg LP",
    address: "0x9F8E...7D6C",
    network: "eip155:8453",
    costPerCall: "$0.15",
    latency: "210ms",
    rating: 4.5,
    category: "Finance",
    verified: false,
    description: "Premium financial data including real-time quotes, company fundamentals, and economic indicators.",
  },
  {
    name: "Wolfram Alpha Compute",
    provider: "Wolfram Research",
    address: "0x4C3B...2A1D",
    network: "eip155:42161",
    costPerCall: "$0.04",
    latency: "380ms",
    rating: 4.4,
    category: "Compute",
    verified: true,
    description: "Computational knowledge engine for mathematics, science, and structured data queries.",
  },
]

const categories = ["All", "LLM", "Search", "Finance", "Compute"]

export default function BazaarPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered = endpoints.filter((ep) => {
    const matchesSearch = ep.name.toLowerCase().includes(search.toLowerCase()) || ep.provider.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === "All" || ep.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">x402 API Bazaar</h1>
        <p className="text-sm text-muted-foreground mt-1">Discover and connect to monetized endpoints for your AI agents</p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search endpoints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-muted/30 border-border/50 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl h-8 text-xs px-3 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Endpoint Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((ep, i) => (
          <motion.div
            key={ep.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
            className="glass-card rounded-2xl p-5 group hover:shadow-[0_0_40px_rgba(100,140,200,0.06)] transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{ep.name}</h3>
                {ep.verified && (
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                )}
              </div>
              <Badge variant="outline" className="text-[10px] rounded-md border-0 bg-muted/50 text-muted-foreground">
                {ep.category}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-4">{ep.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-1.5 text-xs">
                <DollarSign className="w-3 h-3 text-emerald-500" />
                <span className="font-medium">{ep.costPerCall}</span>
                <span className="text-muted-foreground/60">/call</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Clock className="w-3 h-3 text-amber-500" />
                <span className="font-medium">{ep.latency}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{ep.rating}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Globe className="w-3 h-3 text-blue-500" />
                <span className="font-mono text-muted-foreground">{ep.network.split(":")[1]}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/20">
              <span className="text-[10px] font-mono text-muted-foreground">{ep.address}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
