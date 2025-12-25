"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Scenario, ScenarioResults } from "@/lib/types"
import { useState } from "react"

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
    // Single family home - show ONE detailed house with room layout
    const lotSize = scenario.lotSize || 500 // Standard residential lot
    const houseSize = scenario.houseSize || 120 // Total built area
    const bedrooms = Math.round(houseSize / 30) // Estimate based on size
    
    // Use user-provided room sizes
    const masterBedroom = rooms.masterBedroom
    const bedroom2 = rooms.bedroom
    const bedroom3 = rooms.bedroom
    const livingRoom = rooms.livingRoom
    const kitchen = rooms.kitchen
    const diningArea = 10 // m² - not in standard config
    const bathrooms = rooms.bathroom
    const hallway = rooms.hallway

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Site Plan - Takes up 2 columns on desktop, full width on mobile */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border-2 border-blue-400 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative bg-gradient-to-br from-green-100 via-emerald-50 to-green-100 p-8 min-h-96 flex flex-col items-center justify-center">
              {/* Title */}
              <div className="absolute top-3 left-4 text-sm font-bold text-slate-800">
                SINGLE FAMILY HOME - SITE PLAN & LAYOUT
              </div>

              {/* Lot Boundary */}
              <div className="flex justify-center items-center w-full h-full">
                <div className="relative">
                  {/* Land/Lot */}
                  <div
                    className="border-4 border-amber-700 dashed relative flex items-center justify-center bg-gradient-to-b from-green-200 to-emerald-100"
                    style={{
                      width: "320px",
                      height: "320px",
                    }}
                  >
                    {/* Lot label */}
                    <div className="absolute top-2 left-2 text-xs font-bold text-amber-900">
                      LOT: {lotSize}m²
                    </div>

                    {/* House centered on lot */}
                    <div
                      className="border-2 border-slate-800 bg-gradient-to-br from-orange-300 to-orange-400 relative shadow-lg"
                      style={{
                        width: "220px",
                        height: "180px",
                      }}
                      onMouseEnter={() => setHoveredUnit("main-house")}
                      onMouseLeave={() => setHoveredUnit(null)}
                    >
                      {/* House rooms layout */}
                      <div className="absolute inset-0 grid grid-cols-2 gap-1 p-2">
                        {/* Master Bedroom */}
                        <div className="bg-blue-300 border border-blue-600 rounded p-1 col-span-1 row-span-1 flex flex-col items-center justify-center">
                          <div className="text-xs font-bold text-blue-900">Master</div>
                          <div className="text-xs text-blue-900">20m²</div>
                        </div>

                        {/* Bedroom 2 */}
                        <div className="bg-blue-300 border border-blue-600 rounded p-1 flex flex-col items-center justify-center">
                          <div className="text-xs font-bold text-blue-900">Bed 2</div>
                          <div className="text-xs text-blue-900">15m²</div>
                        </div>

                        {/* Living Room - spans 2 columns */}
                        <div className="bg-yellow-300 border border-yellow-600 rounded p-1 col-span-2 flex flex-col items-center justify-center">
                          <div className="text-xs font-bold text-yellow-900">Living/Dining</div>
                          <div className="text-xs text-yellow-900">40m²</div>
                        </div>

                        {/* Kitchen */}
                        <div className="bg-red-300 border border-red-600 rounded p-1 flex flex-col items-center justify-center">
                          <div className="text-xs font-bold text-red-900">Kitchen</div>
                          <div className="text-xs text-red-900">15m²</div>
                        </div>

                        {/* Bathrooms */}
                        <div className="bg-purple-300 border border-purple-600 rounded p-1 flex flex-col items-center justify-center">
                          <div className="text-xs font-bold text-purple-900">Bath (2)</div>
                          <div className="text-xs text-purple-900">10m²</div>
                        </div>
                      </div>

                      {/* House label */}
                      <div className="absolute top-1 right-1 bg-white rounded px-1 text-xs font-bold text-slate-800">
                        {houseSize}m²
                      </div>
                    </div>

                    {/* Yard areas labels */}
                    <div className="absolute bottom-2 left-2 text-xs text-emerald-900 font-semibold">
                      Front Yard
                    </div>
                    <div className="absolute bottom-2 right-2 text-xs text-emerald-900 font-semibold">
                      Back Yard
                    </div>
                    <div className="absolute top-2 right-2 text-xs text-emerald-900 font-semibold">
                      Side Yard
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Details Panel - Shows on click, appears on right on desktop, below on mobile */}
        <div className="lg:col-span-1">
          <button
            onClick={() => setShowDetailsPanel(!showDetailsPanel)}
            className="w-full mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-md"
          >
            {showDetailsPanel ? "Hide Details" : "View Details"}
          </button>
          {showDetailsPanel && (
          <div className="space-y-4 max-h-fit">
            {/* Legend Card */}
            <div className="bg-white rounded-lg p-4 border-2 border-gray-300 shadow-md">
              <h4 className="font-bold text-slate-800 mb-3 text-sm">ROOM TYPES & LEGEND</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-300 border border-blue-600 rounded" />
                  <span className="text-xs text-slate-700">Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-300 border border-yellow-600 rounded" />
                  <span className="text-xs text-slate-700">Living/Dining</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-300 border border-red-600 rounded" />
                  <span className="text-xs text-slate-700">Kitchen</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-300 border border-purple-600 rounded" />
                  <span className="text-xs text-slate-700">Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 border border-green-600 rounded" />
                  <span className="text-xs text-slate-700">Yard/Green Space</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-orange-50 rounded-lg border-2 border-orange-300">
                <div className="text-xs text-slate-600 font-semibold">House Size</div>
                <div className="text-lg font-bold text-orange-600">{houseSize}m²</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-2 border-green-300">
                <div className="text-xs text-slate-600 font-semibold">Lot Size</div>
                <div className="text-lg font-bold text-green-600">{lotSize}m²</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-300">
                <div className="text-xs text-slate-600 font-semibold">Bedrooms</div>
                <div className="text-lg font-bold text-blue-600">{bedrooms}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-300">
                <div className="text-xs text-slate-600 font-semibold">Bathrooms</div>
                <div className="text-lg font-bold text-purple-600">2</div>
              </div>
            </div>

            {/* Room Details */}
            <div className="bg-slate-50 rounded-lg p-3 border-2 border-slate-300">
              <h5 className="font-bold text-slate-800 mb-2 text-xs">ROOM SIZES</h5>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between p-1 bg-blue-100 rounded">
                  <span className="text-blue-900">Master Bedroom</span>
                  <span className="font-bold text-blue-900">{masterBedroom}m²</span>
                </div>
                <div className="flex justify-between p-1 bg-blue-100 rounded">
                  <span className="text-blue-900">Bedroom 2</span>
                  <span className="font-bold text-blue-900">{bedroom2}m²</span>
                </div>
                <div className="flex justify-between p-1 bg-yellow-100 rounded">
                  <span className="text-yellow-900">Living/Dining</span>
                  <span className="font-bold text-yellow-900">{livingRoom + diningArea}m²</span>
                </div>
                <div className="flex justify-between p-1 bg-red-100 rounded">
                  <span className="text-red-900">Kitchen</span>
                  <span className="font-bold text-red-900">{kitchen}m²</span>
                </div>
                <div className="flex justify-between p-1 bg-purple-100 rounded">
                  <span className="text-purple-900">Bathrooms (2)</span>
                  <span className="font-bold text-purple-900">{bathrooms}m²</span>
                </div>
              </div>
            </div>

            {/* Coverage Stats */}
            <div className="bg-emerald-50 rounded-lg p-3 border-2 border-emerald-300">
              <h5 className="font-bold text-emerald-800 mb-2 text-xs">LAND USE</h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-emerald-900">Built-up Area</span>
                  <span className="font-bold text-emerald-900">{Math.round((houseSize / lotSize) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-900">Open Space</span>
                  <span className="font-bold text-emerald-900">{Math.round(((lotSize - houseSize) / lotSize) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-900">Yard Area</span>
                  <span className="font-bold text-emerald-900">{lotSize - houseSize}m²</span>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
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
