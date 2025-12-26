"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Scenario, ScenarioResults } from "@/lib/types"
import { useState } from "react"
import { Maximize2 } from "lucide-react"

interface LayoutVisualizationProps {
  scenario: Scenario
  results: ScenarioResults | null
  roomSizes?: {
    masterBedroom: number
    bedroom: number
    livingRoom: number
    kitchen: number
    bathroom: number
    hallway: number
  }
}

export function LayoutVisualization({ scenario, results, roomSizes }: LayoutVisualizationProps) {
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null)
  const [showDetailsPanel, setShowDetailsPanel] = useState(false)

  if (!results) return null

  // Use provided room sizes or defaults
  const rooms = roomSizes || {
    masterBedroom: 20,
    bedroom: 15,
    livingRoom: 30,
    kitchen: 15,
    bathroom: 10,
    hallway: 8,
  }

  // Determine project type - fallback to apartment if not specified
  const projectType = scenario.projectType || "apartment"

  const renderApartmentLayout = () => {
    const cols = Math.max(1, scenario.unitsPerFloor || 8)
    const rows = Math.max(1, scenario.numberOfFloors || 5)
    
    const buildingColors = { "1": "#ec4899", "2": "#3b82f6", "3": "#f59e0b" }
    
    const unitMix = [
      ...Array(Math.round((scenario.unitMix?.oneBedroom || 40) / 25)).fill("1"),
      ...Array(Math.round((scenario.unitMix?.twoBedroom || 35) / 25)).fill("2"),
      ...Array(Math.round((scenario.unitMix?.threeBedroom || 25) / 25)).fill("3"),
    ]

    let unitIdx = 0
    const gridItems: Array<{ id: string; type: "1" | "2" | "3" }> = []
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (gridItems.length >= results.totalUnits) break
        const type = unitMix[unitIdx % unitMix.length] as "1" | "2" | "3"
        unitIdx++
        gridItems.push({ id: `${r}-${c}`, type })
      }
      if (gridItems.length >= results.totalUnits) break
    }

    return (
      <div className="space-y-4">
        <div className="rounded-lg p-8 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 border-2 border-green-300">
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {gridItems.map((item) => (
              <div
                key={item.id}
                className="aspect-square rounded-lg border-2 transition-all cursor-pointer shadow-sm"
                style={{
                  backgroundColor: buildingColors[item.type],
                  borderColor: hoveredUnit === item.id ? "#000" : "#ffffff80",
                  opacity: hoveredUnit === item.id ? 1 : 0.85,
                  transform: hoveredUnit === item.id ? "scale(1.05)" : "scale(1)",
                }}
                onMouseEnter={() => setHoveredUnit(item.id)}
                onMouseLeave={() => setHoveredUnit(null)}
              >
                <div className="flex items-center justify-center h-full font-bold text-white text-sm">
                  {item.type}B
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-pink-50 rounded border border-pink-200">
            <div className="text-xs text-slate-600 font-semibold">1-Bed</div>
            <div className="text-xl font-bold text-pink-600">{Math.round(((scenario.unitMix?.oneBedroom || 40) / 100) * results.totalUnits)}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <div className="text-xs text-slate-600 font-semibold">2-Bed</div>
            <div className="text-xl font-bold text-blue-600">{Math.round(((scenario.unitMix?.twoBedroom || 35) / 100) * results.totalUnits)}</div>
          </div>
          <div className="p-3 bg-amber-50 rounded border border-amber-200">
            <div className="text-xs text-slate-600 font-semibold">3-Bed</div>
            <div className="text-xl font-bold text-amber-600">{Math.round(((scenario.unitMix?.threeBedroom || 25) / 100) * results.totalUnits)}</div>
          </div>
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <div className="text-xs text-slate-600 font-semibold">Population</div>
            <div className="text-xl font-bold text-green-600">{results.estimatedPopulation}</div>
          </div>
        </div>
      </div>
    )
  }

  const renderSingleFamilyLayout = () => {
    const lotSize = scenario.lotSize || 500
    const houseSize = scenario.houseSize || 120
    const bedrooms = Math.round(houseSize / 30)
    const masterBedroom = rooms.masterBedroom
    const bedroom2 = rooms.bedroom
    const livingRoom = rooms.livingRoom
    const kitchen = rooms.kitchen
    const bathrooms = rooms.bathroom
    const coverage = ((houseSize / lotSize) * 100).toFixed(1)
    const greenSpace = (100 - parseFloat(coverage)).toFixed(1)

    return (
      <div className="space-y-6">
        {/* Layout Visualization Card */}
        <Card className="border-0 shadow-xl overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <CardTitle className="text-lg flex items-center gap-2">
              <Maximize2 className="w-5 h-5" />
              Your Home Layout
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-center">
              <div className="relative w-full">
                {/* Lot Boundary */}
                <div
                  className="border-4 border-dashed border-amber-700 relative flex items-center justify-center bg-gradient-to-b from-green-100 to-emerald-50 p-4 mx-auto"
                  style={{
                    width: "300px",
                    height: "300px",
                  }}
                >
                  <div className="absolute top-3 left-4 text-xs font-bold text-amber-900">
                    LAND: {lotSize}m²
                  </div>

                  {/* House */}
                  <div
                    className="border-2 border-slate-800 bg-gradient-to-br from-orange-300 to-orange-400 relative shadow-lg"
                    style={{
                      width: "280px",
                      height: "220px",
                    }}
                  >
                    {/* Rooms Grid */}
                    <div className="absolute inset-0 grid grid-cols-3 gap-1 p-2">
                      {/* Master Bedroom */}
                      <div className="bg-blue-400 border border-blue-600 rounded p-1 col-span-1 row-span-2 flex flex-col items-center justify-center">
                        <div className="text-xs font-bold text-blue-900">Master</div>
                        <div className="text-xs text-blue-900">{masterBedroom}m²</div>
                      </div>

                      {/* Bed 2 */}
                      <div className="bg-blue-400 border border-blue-600 rounded p-1 flex flex-col items-center justify-center">
                        <div className="text-xs font-bold text-blue-900">Bed 2</div>
                        <div className="text-xs text-blue-900">{bedroom2}m²</div>
                      </div>

                      {/* Living */}
                      <div className="bg-yellow-300 border border-yellow-600 rounded p-1 col-span-2 row-span-2 flex flex-col items-center justify-center">
                        <div className="text-xs font-bold text-yellow-900">Living/Dining</div>
                        <div className="text-xs text-yellow-900">{livingRoom}m²</div>
                      </div>

                      {/* Kitchen */}
                      <div className="bg-red-400 border border-red-600 rounded p-1 flex flex-col items-center justify-center">
                        <div className="text-xs font-bold text-red-900">Kitchen</div>
                        <div className="text-xs text-red-900">{kitchen}m²</div>
                      </div>

                      {/* Bath */}
                      <div className="bg-purple-400 border border-purple-600 rounded p-1 col-span-1 flex flex-col items-center justify-center">
                        <div className="text-xs font-bold text-purple-900">Bath</div>
                        <div className="text-xs text-purple-900">{bathrooms}m²</div>
                      </div>
                    </div>

                    <div className="absolute top-1 right-1 bg-white rounded px-2 py-1 text-xs font-bold text-slate-800">
                      {houseSize}m²
                    </div>
                  </div>

                  {/* Yard Labels */}
                  <div className="absolute bottom-2 left-3 text-xs text-emerald-900 font-semibold">Front</div>
                  <div className="absolute bottom-2 right-3 text-xs text-emerald-900 font-semibold">Back</div>
                  <div className="absolute top-3 right-3 text-xs text-emerald-900 font-semibold">Side</div>
                </div>
              </div>
            </div>

            {/* Layout Stats */}
            <div className="relative mt-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
    {/* Land Coverage Card */}
    <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="text-sm text-slate-600 font-semibold">Land Coverage</div>
      <div className="text-3xl font-bold text-blue-600 mt-2">{coverage}%</div>
    </div>

    {/* Green Space Card */}
    <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="text-sm text-slate-600 font-semibold">Green Space</div>
      <div className="text-3xl font-bold text-emerald-600 mt-2">{greenSpace}%</div>
    </div>

    {/* Building Area Card */}
    <div className="bg-amber-50 rounded-lg border border-amber-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="text-sm text-slate-600 font-semibold">Building Area</div>
      <div className="text-3xl font-bold text-amber-600 mt-2">{houseSize} m²</div>
    </div>
  </div>
</div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Bedrooms</div>
            <div className="text-3xl font-bold text-blue-600 flex-grow">{bedrooms}</div>
            <div className="text-xs text-slate-400 mt-1">Total count</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Bathrooms</div>
            <div className="text-3xl font-bold text-indigo-600 flex-grow">2</div>
            <div className="text-xs text-slate-400 mt-1">Total count</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Lot Size</div>
            <div className="text-2xl font-bold text-emerald-600 flex-grow">{lotSize}m²</div>
            <div className="text-xs text-slate-400 mt-1">Total area</div>
          </div>
        </div>

        {/* Room Details */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-slate-500 to-slate-600 text-white">
            <CardTitle className="text-lg">Room Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-semibold text-slate-900">Master Bedroom</span>
                <span className="text-lg font-bold text-blue-600">{masterBedroom}m²</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-semibold text-slate-900">Bedroom 2</span>
                <span className="text-lg font-bold text-blue-600">{bedroom2}m²</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="font-semibold text-slate-900">Living/Dining</span>
                <span className="text-lg font-bold text-yellow-600">{livingRoom}m²</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="font-semibold text-slate-900">Kitchen</span>
                <span className="text-lg font-bold text-red-600">{kitchen}m²</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="font-semibold text-slate-900">Bathrooms</span>
                <span className="text-lg font-bold text-purple-600">{bathrooms}m²</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderMixedLayout = () => {
    const apartmentCols = Math.max(1, Math.ceil(Math.sqrt(scenario.apartmentUnits || 100)))
    const apartmentRows = Math.ceil((scenario.apartmentUnits || 100) / apartmentCols)
    const singleFamilyCols = Math.min(6, Math.ceil(Math.sqrt(scenario.singleFamilyUnits || 50)))
    const singleFamilyRows = Math.ceil((scenario.singleFamilyUnits || 50) / singleFamilyCols)

    const apartmentItems = Array.from({ length: scenario.apartmentUnits || 100 }, (_, i) => ({
      id: `apt-${i}`,
      type: i % 3 === 0 ? "1" : i % 3 === 1 ? "2" : "3",
    }))

    const singleFamilyItems = Array.from({ length: scenario.singleFamilyUnits || 50 }, (_, i) => ({
      id: `house-${i}`,
      number: i + 1,
    }))

    const buildingColors = { "1": "#ec4899", "2": "#3b82f6", "3": "#f59e0b" }

    return (
      <div className="space-y-6">
        {/* Apartments Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-slate-700">Apartment Block</h3>
          <div className="rounded-lg p-6 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 border-2 border-green-300">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(8, apartmentCols)}, 1fr)` }}>
              {apartmentItems.slice(0, 40).map((item) => (
                <div
                  key={item.id}
                  className="aspect-square rounded border transition-all cursor-pointer"
                  style={{
                    backgroundColor: buildingColors[item.type as keyof typeof buildingColors],
                    borderColor: hoveredUnit === item.id ? "#000" : "#ffffff80",
                    opacity: hoveredUnit === item.id ? 1 : 0.8,
                  }}
                  onMouseEnter={() => setHoveredUnit(item.id)}
                  onMouseLeave={() => setHoveredUnit(null)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Single-Family Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-slate-700">Single-Family Homes</h3>
          <div className="rounded-lg p-6 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 border-2 border-green-300">
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${singleFamilyCols}, 1fr)` }}>
              {singleFamilyItems.map((item) => (
                <div
                  key={item.id}
                  className="aspect-square rounded-lg bg-amber-500 border-2 transition-all cursor-pointer"
                  style={{
                    borderColor: hoveredUnit === item.id ? "#000" : "#ffffff80",
                    opacity: hoveredUnit === item.id ? 1 : 0.85,
                  }}
                  onMouseEnter={() => setHoveredUnit(item.id)}
                  onMouseLeave={() => setHoveredUnit(null)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <div className="text-xs text-slate-600 font-semibold">Apartments</div>
            <div className="text-xl font-bold text-blue-600">{scenario.apartmentUnits || 100}</div>
          </div>
          <div className="p-3 bg-amber-50 rounded border border-amber-200">
            <div className="text-xs text-slate-600 font-semibold">Single-Family</div>
            <div className="text-xl font-bold text-amber-600">{scenario.singleFamilyUnits || 50}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded border border-purple-200">
            <div className="text-xs text-slate-600 font-semibold">Total Units</div>
            <div className="text-xl font-bold text-purple-600">{results.totalUnits}</div>
          </div>
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <div className="text-xs text-slate-600 font-semibold">Population</div>
            <div className="text-xl font-bold text-green-600">{results.estimatedPopulation}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Site Layout
          {projectType === "apartment" && " - Multi-Unit Apartments"}
          {projectType === "single-family" && " - Single-Family Homes"}
          {projectType === "mixed" && " - Mixed Development"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {projectType === "apartment" && renderApartmentLayout()}
        {projectType === "single-family" && renderSingleFamilyLayout()}
        {projectType === "mixed" && renderMixedLayout()}
      </CardContent>
    </Card>
  )
}
