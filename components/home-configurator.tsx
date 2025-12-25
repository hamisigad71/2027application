"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import type { HomeBuilderConfig, HomeSpecification } from "@/lib/types"
import { calculateHomeSpecification } from "@/lib/calculations"
import { getAvailableCountries } from "@/lib/country-data"
import { DollarSign, Home, Zap, Droplet, TreePine, Car, Lightbulb, ArrowLeft, Bed, Maximize2, Download, Building2, MapPin } from "lucide-react"

export function HomeConfigurator() {
  const [config, setConfig] = useState<HomeBuilderConfig & { bedrooms?: number }>({
    id: Math.random().toString(36).substr(2, 9),
    userId: "current-user",
    country: "Kenya",
    countryCode: "KE",
    landSize: 500,
    budget: 50000,
    style: "standard",
    sizePreference: "medium",
    bedrooms: 2,
    features: {
      solarPanels: false,
      smartHome: false,
      airConditioning: false,
      swimmingPool: false,
      garage: false,
      garden: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  const [specification, setSpecification] = useState<HomeSpecification | null>(null)
  const countries = getAvailableCountries()

  const handleCalculate = () => {
    const result = calculateHomeSpecification(config)
    setSpecification(result)
  }

  const handleFeatureToggle = (feature: keyof typeof config.features) => {
    setConfig((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature],
      },
    }))
  }

  const handleExportPDF = () => {
    if (!specification) return
    
    // Simple PDF generation (can be enhanced with jsPDF library)
    const pdfContent = generatePDFContent(config, specification)
    const link = document.createElement("a")
    const blob = new Blob([pdfContent], { type: "text/html" })
    link.href = URL.createObjectURL(blob)
    link.download = `home-plan-${new Date().getTime()}.html`
    link.click()
  }

  const budgetStatus = specification
    ? specification.percentageUsed > 100
      ? "over"
      : specification.percentageUsed > 90
        ? "tight"
        : "comfortable"
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* NAVBAR */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Home Builder</h1>
                <p className="text-xs text-slate-500">Design your perfect home</p>
              </div>
            </div>
            <Button
              onClick={() => window.location.href = "/"}
              variant="ghost"
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Design Your Dream Home</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Configure your preferences and get instant cost estimates, detailed layouts, and maintenance projections.
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT PANEL */}
          <div className="lg:col-span-5 space-y-6">
            {/* Location & Budget */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location & Budget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div>
                  <Label className="text-sm font-bold text-slate-900 mb-3 block">Select Country</Label>
                  <Select value={config.countryCode} onValueChange={(code) => {
                    const country = countries.find((c) => c.code === code)
                    if (country) setConfig((prev) => ({ ...prev, countryCode: code, country: country.name }))
                  }}>
                    <SelectTrigger className="border-2 border-slate-200 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name} ({country.region})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-bold text-slate-900">Land Size</Label>
                    <span className="text-lg font-bold text-blue-600">{config.landSize}m²</span>
                  </div>
                  <Slider value={[config.landSize]} onValueChange={(value) => setConfig((prev) => ({ ...prev, landSize: value[0] }))} min={200} max={5000} step={50} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-bold text-slate-900">Total Budget</Label>
                    <span className="text-lg font-bold text-green-600">${config.budget.toLocaleString()}</span>
                  </div>
                  <Slider value={[config.budget]} onValueChange={(value) => setConfig((prev) => ({ ...prev, budget: value[0] }))} min={10000} max={500000} step={5000} />
                </div>
              </CardContent>
            </Card>

            {/* Style & Design */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow bg-white">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Style & Design
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div>
                  <Label className="text-sm font-bold text-slate-900 mb-3 block">Home Style</Label>
                  <Select value={config.style} onValueChange={(value: any) => setConfig((prev) => ({ ...prev, style: value }))}>
                    <SelectTrigger className="border-2 border-slate-200 focus:border-amber-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (Budget-Friendly)</SelectItem>
                      <SelectItem value="standard">Standard (Balanced)</SelectItem>
                      <SelectItem value="modern">Modern (Contemporary)</SelectItem>
                      <SelectItem value="traditional">Traditional (Classic)</SelectItem>
                      <SelectItem value="luxury">Luxury (Premium)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-bold text-slate-900 mb-3 block">Home Size</Label>
                  <Select value={config.sizePreference} onValueChange={(value: any) => setConfig((prev) => ({ ...prev, sizePreference: value }))}>
                    <SelectTrigger className="border-2 border-slate-200 focus:border-amber-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (60m²)</SelectItem>
                      <SelectItem value="medium">Medium (100m²)</SelectItem>
                      <SelectItem value="large">Large (150m²)</SelectItem>
                      <SelectItem value="spacious">Spacious (200m²)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-bold text-slate-900 mb-3 block flex items-center gap-2">
                    <Bed className="w-4 h-4" />
                    Number of Bedrooms
                  </Label>
                  <Select value={String(config.bedrooms)} onValueChange={(value: any) => setConfig((prev) => ({ ...prev, bedrooms: parseInt(value) }))}>
                    <SelectTrigger className="border-2 border-slate-200 focus:border-amber-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4">4 Bedrooms</SelectItem>
                      <SelectItem value="5">5+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow bg-white">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Premium Features
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "solarPanels", label: "Solar Panels", icon: Zap, cost: 8000 },
                    { key: "smartHome", label: "Smart Home", icon: Lightbulb, cost: 5000 },
                    { key: "airConditioning", label: "AC System", icon: Zap, cost: 6000 },
                    { key: "swimmingPool", label: "Pool", icon: Droplet, cost: 25000 },
                    { key: "garage", label: "Garage", icon: Car, cost: 12000 },
                    { key: "garden", label: "Garden", icon: TreePine, cost: 4000 },
                  ].map(({ key, label, cost }) => (
                    <label key={key} className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all border-2 ${
                      config.features[key as keyof typeof config.features]
                        ? "border-purple-500 bg-purple-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}>
                      <input type="checkbox" checked={config.features[key as keyof typeof config.features]} onChange={() => handleFeatureToggle(key as keyof typeof config.features)} className="mb-2" />
                      <span className="text-xs font-semibold text-slate-900 text-center">{label}</span>
                      <span className="text-xs text-slate-500 mt-1">${(cost / 1000).toFixed(0)}k</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Buttons */}
            <div className="flex gap-3 sticky bottom-4">
              <Button onClick={handleCalculate} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-bold shadow-xl">
                <Building2 className="w-5 h-5 mr-2" />
                Calculate & Design
              </Button>
              {specification && (
                <Button onClick={handleExportPDF} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-6 text-lg font-bold shadow-xl">
                  <Download className="w-5 h-5 mr-2" />
                  Export PDF
                </Button>
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-7 space-y-6">
            {!specification ? (
              <Card className="border-0 shadow-xl h-96 flex items-center justify-center bg-white">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-6">
                    <Home className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to Design?</h3>
                  <p className="text-slate-500 max-w-md">Configure your preferences and click "Calculate & Design" to generate your personalized home plan with detailed layouts and costs.</p>
                </div>
              </Card>
            ) : (
              <>
                {/* Layout Visualization */}
                <Card className="border-0 shadow-xl overflow-hidden bg-white">
                  <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Maximize2 className="w-5 h-5" />
                      Your Home Layout
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8 pb-8">
                    <div className="flex justify-center">
                      <div className="border-4 border-dashed border-amber-700 relative flex items-center justify-center bg-gradient-to-b from-green-100 to-emerald-50 p-8" style={{ width: "400px", height: "400px" }}>
                        <div className="absolute top-3 left-4 text-xs font-bold text-amber-900">LAND: {config.landSize}m²</div>
                        <div className="border-2 border-slate-800 bg-gradient-to-br from-orange-300 to-orange-400 relative shadow-lg" style={{ width: "280px", height: "220px" }}>
                          <div className="absolute inset-0 grid grid-cols-3 gap-1 p-2">
                            <div className="bg-blue-400 border border-blue-600 rounded p-1 col-span-1 row-span-2 flex flex-col items-center justify-center"><div className="text-xs font-bold text-blue-900">Master</div></div>
                            <div className="bg-blue-400 border border-blue-600 rounded p-1 flex flex-col items-center justify-center"><div className="text-xs font-bold text-blue-900">Bed 2</div></div>
                            <div className="bg-yellow-300 border border-yellow-600 rounded p-1 col-span-2 row-span-2 flex flex-col items-center justify-center"><div className="text-xs font-bold text-yellow-900">Living</div></div>
                            <div className="bg-red-400 border border-red-600 rounded p-1 flex flex-col items-center justify-center"><div className="text-xs font-bold text-red-900">Kitchen</div></div>
                            <div className="bg-purple-400 border border-purple-600 rounded p-1 col-span-1 flex flex-col items-center justify-center"><div className="text-xs font-bold text-purple-900">Bath</div></div>
                          </div>
                          <div className="absolute top-1 right-1 bg-white rounded px-2 py-1 text-xs font-bold text-slate-800">{Math.round(specification.totalBuildingArea)}m²</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200"><div className="text-xs text-slate-600 font-semibold">Coverage</div><div className="text-2xl font-bold text-blue-600">{((specification.totalBuildingArea / config.landSize) * 100).toFixed(1)}%</div></div>
                      <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200"><div className="text-xs text-slate-600 font-semibold">Green Space</div><div className="text-2xl font-bold text-emerald-600">{((1 - specification.totalBuildingArea / config.landSize) * 100).toFixed(1)}%</div></div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200"><div className="text-xs text-slate-600 font-semibold">Building</div><div className="text-2xl font-bold text-amber-600">{Math.round(specification.totalBuildingArea)}m²</div></div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white"><CardContent className="pt-4"><div className="text-sm opacity-90 mb-1">Bedrooms</div><div className="text-4xl font-bold">{config.bedrooms}</div></CardContent></Card>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white"><CardContent className="pt-4"><div className="text-sm opacity-90 mb-1">Bathrooms</div><div className="text-4xl font-bold">{specification.bathrooms}</div></CardContent></Card>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white"><CardContent className="pt-4"><div className="text-sm opacity-90 mb-1">Timeline</div><div className="text-4xl font-bold">{specification.estimatedTimelineMonths}mo</div></CardContent></Card>
                </div>

                {/* Cost Breakdown */}              <Card className="border-0 shadow-xl bg-white">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Total Cost Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"><span className="font-semibold text-slate-700">Building</span><span className="text-lg font-bold text-slate-900">${specification.buildingCost.toLocaleString()}</span></div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"><span className="font-semibold text-slate-700">Labor</span><span className="text-lg font-bold text-slate-900">${specification.laborCost.toLocaleString()}</span></div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"><span className="font-semibold text-slate-700">Infrastructure</span><span className="text-lg font-bold text-slate-900">${specification.infrastructureCost.toLocaleString()}</span></div>
                      {specification.featuresCost > 0 && <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg"><span className="font-semibold text-slate-700">Features</span><span className="text-lg font-bold text-purple-700">${specification.featuresCost.toLocaleString()}</span></div>}
                      <div className="border-t-2 border-slate-300 mt-4 pt-4 flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg"><span className="font-bold text-slate-900 text-lg">Total</span><span className={`text-2xl font-bold ${budgetStatus === "over" ? "text-red-600" : budgetStatus === "tight" ? "text-amber-600" : "text-green-600"}`}>${specification.totalCost.toLocaleString()}</span></div>
                    </div>
                    <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200"><div className="text-sm font-bold text-slate-900 mb-3">Budget Status</div><div className="flex justify-between mb-3"><span className="text-sm font-semibold text-slate-700">Used</span><span className={`text-sm font-bold ${budgetStatus === "over" ? "text-red-600" : budgetStatus === "tight" ? "text-amber-600" : "text-green-600"}`}>{specification.percentageUsed.toFixed(1)}%</span></div><div className="w-full bg-slate-300 rounded-full h-3"><div className={`h-3 rounded-full transition-all ${budgetStatus === "over" ? "bg-red-500" : budgetStatus === "tight" ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${Math.min(specification.percentageUsed, 100)}%` }} /></div><div className="flex justify-between mt-3"><span className="text-xs font-semibold text-slate-600">Your Budget</span><span className="text-xs font-bold text-slate-900">{specification.remainingBudget > 0 ? `$${specification.remainingBudget.toLocaleString()} left` : `$${Math.abs(specification.remainingBudget).toLocaleString()} over`}</span></div></div>
                  </CardContent>
                </Card>

                {/* Operating Costs */}
                <Card className="border-0 shadow-xl bg-white">
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                    <CardTitle className="text-lg">Annual Operating Costs</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border-2 border-orange-200"><div className="text-xs text-slate-600 font-semibold mb-2">Maintenance</div><div className="text-2xl font-bold text-orange-600">${specification.annualMaintenanceCost.toLocaleString()}</div><div className="text-xs text-slate-500 mt-1">/year</div></div>
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200"><div className="text-xs text-slate-600 font-semibold mb-2">Utilities</div><div className="text-2xl font-bold text-blue-600">${specification.monthlyUtilitiesCost.toLocaleString()}</div><div className="text-xs text-slate-500 mt-1">/month</div></div>
                      <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border-2 border-emerald-200"><div className="text-xs text-slate-600 font-semibold mb-2">Tax</div><div className="text-2xl font-bold text-emerald-600">${specification.propertyTaxAnnual.toLocaleString()}</div><div className="text-xs text-slate-500 mt-1">/year</div></div>
                      <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border-2 border-red-200"><div className="text-xs text-slate-600 font-semibold mb-2">Insurance</div><div className="text-2xl font-bold text-red-600">${specification.insuranceAnnual.toLocaleString()}</div><div className="text-xs text-slate-500 mt-1">/year</div></div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function generatePDFContent(config: HomeBuilderConfig & { bedrooms?: number }, spec: HomeSpecification): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Home Plan Report</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#333;background:#f9fafb}.container{background:white;padding:40px;border-radius:8px}h1{color:#1f2937;border-bottom:3px solid #2563eb;padding-bottom:15px;margin-bottom:30px}h2{color:#1f2937;margin-top:30px;margin-bottom:15px;border-left:4px solid #2563eb;padding-left:15px}.section{margin:20px 0}.row{display:flex;gap:20px}.col{flex:1}table{width:100%;border-collapse:collapse;margin-top:15px}th,td{padding:12px;text-align:left;border-bottom:1px solid #e5e7eb}th{background:#f3f4f6;font-weight:bold}.cost-section{background:#f9fafb;padding:20px;border-radius:8px;margin:15px 0;border-left:4px solid #2563eb}.highlight{background:#dbeafe;padding:15px;border-left:4px solid #2563eb;margin:15px 0;border-radius:4px}.total{font-weight:bold;background:#f3f4f6}.footer{margin-top:40px;padding-top:20px;border-top:1px solid #d1d5db;font-size:12px;color:#6b7280;text-align:center}</style></head><body><div class="container"><h1>HOME PLAN & COST REPORT</h1><div class="section"><h2>Project Details</h2><div class="row"><div class="col"><strong>Country:</strong> ${config.country}<br><strong>Land:</strong> ${config.landSize}m²<br><strong>Budget:</strong> $${config.budget.toLocaleString()}</div><div class="col"><strong>Style:</strong> ${config.style}<br><strong>Size:</strong> ${config.sizePreference}<br><strong>Bedrooms:</strong> ${config.bedrooms}</div></div></div><div class="section"><h2>Home Specification</h2><div class="cost-section"><div class="row"><div class="col"><strong>Building Area:</strong> ${Math.round(spec.totalBuildingArea)}m²</div><div class="col"><strong>Bedrooms:</strong> ${spec.bedrooms}</div><div class="col"><strong>Timeline:</strong> ${spec.estimatedTimelineMonths} months</div></div></div></div><div class="section"><h2>Cost Breakdown</h2><table><tr><th>Item</th><th>Cost</th></tr><tr><td>Building Construction</td><td>$${spec.buildingCost.toLocaleString()}</td></tr><tr><td>Labor</td><td>$${spec.laborCost.toLocaleString()}</td></tr><tr><td>Infrastructure</td><td>$${spec.infrastructureCost.toLocaleString()}</td></tr>${spec.featuresCost > 0 ? `<tr><td>Features</td><td>$${spec.featuresCost.toLocaleString()}</td></tr>` : ""}<tr class="total"><td>TOTAL</td><td>$${spec.totalCost.toLocaleString()}</td></tr></table></div><div class="section"><h2>Annual Operating Costs</h2><div class="highlight"><strong>Maintenance:</strong> $${spec.annualMaintenanceCost.toLocaleString()}/year<br><strong>Utilities:</strong> $${spec.monthlyUtilitiesCost.toLocaleString()}/month<br><strong>Tax:</strong> $${spec.propertyTaxAnnual.toLocaleString()}/year<br><strong>Insurance:</strong> $${spec.insuranceAnnual.toLocaleString()}/year</div></div><div class="section"><h2>Budget Status</h2><div class="cost-section"><strong>Total Budget:</strong> $${config.budget.toLocaleString()}<br><strong>Project Cost:</strong> $${spec.totalCost.toLocaleString()}<br><strong>Remaining:</strong> ${spec.remainingBudget > 0 ? `$${spec.remainingBudget.toLocaleString()}` : `($${Math.abs(spec.remainingBudget).toLocaleString()})`}<br><strong>Used:</strong> ${spec.percentageUsed.toFixed(1)}%</div></div><div class="footer"><p>Generated by Housing Planning Tool</p></div></div></body></html>`
}
