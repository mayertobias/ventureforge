"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ExternalLink, Star, Users, Zap, TrendingUp } from "lucide-react";

const marketplaceItems = [
  {
    id: 1,
    name: "Business Model Canvas Template",
    description: "Professional template for creating comprehensive business model canvases",
    price: "Free",
    category: "Templates",
    rating: 4.8,
    users: 1250,
    icon: "📊",
    link: "#",
  },
  {
    id: 2,
    name: "Financial Modeling Spreadsheet",
    description: "Advanced Excel/Google Sheets template for financial projections",
    price: "$29",
    category: "Tools",
    rating: 4.9,
    users: 856,
    icon: "💹",
    link: "#",
  },
  {
    id: 3,
    name: "Pitch Deck Template - Series A",
    description: "Investor-ready pitch deck template used by successful startups",
    price: "$49",
    category: "Templates",
    rating: 4.7,
    users: 642,
    icon: "🎯",
    link: "#",
  },
  {
    id: 4,
    name: "Market Research Toolkit",
    description: "Comprehensive tools and frameworks for market analysis",
    price: "$39",
    category: "Tools",
    rating: 4.6,
    users: 423,
    icon: "🔍",
    link: "#",
  },
  {
    id: 5,
    name: "Legal Document Templates",
    description: "Essential legal templates for early-stage startups",
    price: "$99",
    category: "Legal",
    rating: 4.8,
    users: 278,
    icon: "📋",
    link: "#",
  },
  {
    id: 6,
    name: "Brand Identity Kit",
    description: "Complete branding toolkit with logos, colors, and guidelines",
    price: "$79",
    category: "Design",
    rating: 4.5,
    users: 334,
    icon: "🎨",
    link: "#",
  },
];

const categories = [
  { name: "All", count: marketplaceItems.length },
  { name: "Templates", count: 2 },
  { name: "Tools", count: 2 },
  { name: "Legal", count: 1 },
  { name: "Design", count: 1 },
];

export default function MarketplacePage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground">
          Discover templates, tools, and resources to accelerate your business planning
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge key={category.name} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            {category.name} ({category.count})
          </Badge>
        ))}
      </div>

      {/* Featured Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-blue-900">
                🚀 Coming Soon: AI-Powered Market Research
              </h3>
              <p className="text-blue-700">
                Get real-time market insights and competitor analysis powered by our AI engine
              </p>
            </div>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
              Get Notified
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Marketplace Items */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {marketplaceItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    <Badge variant="secondary">{item.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{item.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{item.users} users</span>
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{item.price}</div>
                  {item.price !== "Free" && (
                    <div className="text-xs text-muted-foreground">One-time purchase</div>
                  )}
                </div>
                <Button className="flex-shrink-0">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {item.price === "Free" ? "Download" : "Purchase"}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom CTA */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">
                Become a Marketplace Partner
              </h3>
            </div>
            <p className="text-green-700 max-w-2xl mx-auto">
              Share your expertise and earn revenue by creating templates, tools, and resources for the VentureForge community
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              <Zap className="h-4 w-4 mr-2" />
              Apply to Become a Partner
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}