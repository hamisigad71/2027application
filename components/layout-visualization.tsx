"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Scenario, ScenarioResults } from "@/lib/types"

interface LayoutVisualizationProps {
  scenario: Scenario
  results: ScenarioResults | null
}

export function LayoutVisualization({ scenario, results }: LayoutVisualizationProps) {
  if (!results) return null

  const densityColors = {
    low: "#10b981",
    medium: "#3b82f6",
    high: "#f59e0b",
    "very-high": "#ef4444",
  }

  const densityColor = densityColors[results.densityClassification]

  // Calculate visualization dimensions
  const maxUnitsToShow = 12
  const unitsToShow = Math.min(scenario.unitsPerFloor, maxUnitsToShow)
  const floorsToShow = Math.min(scenario.numberOfFloors, 8)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Layout Visualization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Building Visualization */}
        <div className="bg-slate-50 rounded-lg p-6 flex items-center justify-center">
          <div className="space-y-2">
            {Array.from({ length: floorsToShow }).map((_, floorIndex) => (
              <div key={floorIndex} className="flex gap-2">
                {Array.from({ length: unitsToShow }).map((_, unitIndex) => (
                  <div
                    key={unitIndex}
                    className="w-8 h-8 rounded border-2 transition-colors"
                    style={{
                      borderColor: densityColor,
                      backgroundColor: `${densityColor}20`,
                    }}
                    title={`Floor ${floorsToShow - floorIndex}, Unit ${unitIndex + 1}`}
                  />
                ))}
                {scenario.unitsPerFloor > maxUnitsToShow && (
                  <div className="flex items-center justify-center text-xs text-slate-500 pl-2">
                    +{scenario.unitsPerFloor - maxUnitsToShow}
                  </div>
                )}
              </div>
            ))}
            {scenario.numberOfFloors > 8 && (
              <div className="text-center text-xs text-slate-500 pt-2">+{scenario.numberOfFloors - 8} more floors</div>
            )}
          </div>
        </div>

        {/* Density Indicator */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Density Classification</span>
            <span className="font-semibold capitalize" style={{ color: densityColor }}>
              {results.densityClassification.replace("-", " ")}
            </span>
          </div>

          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${Math.min((results.totalUnits / scenario.unitsPerFloor / 20) * 100, 100)}%`,
                backgroundColor: densityColor,
              }}
            />
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs text-slate-600">
            <div className="text-center">
              <div className="w-full h-1 bg-green-500 rounded mb-1" />
              Low
            </div>
            <div className="text-center">
              <div className="w-full h-1 bg-blue-500 rounded mb-1" />
              Medium
            </div>
            <div className="text-center">
              <div className="w-full h-1 bg-orange-500 rounded mb-1" />
              High
            </div>
            <div className="text-center">
              <div className="w-full h-1 bg-red-500 rounded mb-1" />
              Very High
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
          <div>
            <div className="text-xs text-slate-600">Total Units</div>
            <div className="text-2xl font-semibold text-slate-900">{results.totalUnits}</div>
          </div>
          <div>
            <div className="text-xs text-slate-600">Built-up Area</div>
            <div className="text-2xl font-semibold text-slate-900">
              {Math.round(results.builtUpArea).toLocaleString()} m²
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-600">Population</div>
            <div className="text-2xl font-semibold text-slate-900">{results.estimatedPopulation}</div>
          </div>
          <div>
            <div className="text-xs text-slate-600">Land Coverage</div>
            <div className="text-2xl font-semibold text-slate-900">{results.landCoveragePercentage.toFixed(1)}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
