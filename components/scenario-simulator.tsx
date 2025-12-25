"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Scenario, Project, ScenarioResults } from "@/lib/types"
import { scenarioStorage, costAssumptionsStorage } from "@/lib/storage"
import { calculateScenarioResults } from "@/lib/calculations"
import { LayoutVisualization } from "./layout-visualization"
import { ResultsPanel } from "./results-panel"

interface ScenarioSimulatorProps {
  scenario: Scenario
  project: Project
  onUpdate: () => void
}

export function ScenarioSimulator({ scenario: initialScenario, project, onUpdate }: ScenarioSimulatorProps) {
  const [scenario, setScenario] = useState(initialScenario)
  const [results, setResults] = useState<ScenarioResults | null>(null)

  useEffect(() => {
    setScenario(initialScenario)
  }, [initialScenario])

  // Recalculate results whenever scenario changes
  useEffect(() => {
    const costAssumptions = costAssumptionsStorage.get(project.location.country)
    const landSizeInSqm = project.landSizeUnit === "acres" ? project.landSize * 4046.86 : project.landSize

    const calculatedResults = calculateScenarioResults(scenario, project.budgetRange, landSizeInSqm, costAssumptions)

    setResults(calculatedResults)
  }, [scenario, project])

  const handleScenarioChange = (updates: Partial<Scenario>) => {
    const updated = { ...scenario, ...updates }
    setScenario(updated)
  }

  const handleSave = () => {
    scenarioStorage.update(scenario.id, {
      ...scenario,
      calculatedResults: results,
    })
    onUpdate()
  }

  const handleNameChange = (name: string) => {
    const updated = { ...scenario, name }
    setScenario(updated)
    scenarioStorage.update(scenario.id, { name })
    onUpdate()
  }

  const isApartment = project.projectType === "apartment"
  const isSingleFamily = project.projectType === "single-family"
  const isMixed = project.projectType === "mixed"

  return (
    <div className="space-y-6">
      {/* Scenario Name */}
      <Card>
        <CardHeader>
          <CardTitle>Scenario Configuration</CardTitle>
          <CardDescription>Adjust parameters to see real-time updates to costs and population impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="scenarioName">Scenario Name</Label>
            <Input
              id="scenarioName"
              value={scenario.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., High-Density Option"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameters */}
        <div className="lg:col-span-5 space-y-6">
          {/* Layout Parameters */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-lg font-semibold text-slate-900">Layout Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {(isApartment || isMixed) && (
                <>
                  {/* Unit Size */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Unit Size (m²)</Label>
                      <span className="text-sm font-semibold text-slate-900">{scenario.unitSize || 50} m²</span>
                    </div>
                    <Slider
                      value={[scenario.unitSize || 50]}
                      onValueChange={([value]) => handleScenarioChange({ unitSize: value })}
                      min={30}
                      max={120}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Units Per Floor */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Units per Floor</Label>
                      <span className="text-sm font-semibold text-slate-900">{scenario.unitsPerFloor || 8}</span>
                    </div>
                    <Slider
                      value={[scenario.unitsPerFloor || 8]}
                      onValueChange={([value]) => handleScenarioChange({ unitsPerFloor: value })}
                      min={2}
                      max={24}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Number of Floors */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Number of Floors</Label>
                      <span className="text-sm font-semibold text-slate-900">{scenario.numberOfFloors || 5}</span>
                    </div>
                    <Slider
                      value={[scenario.numberOfFloors || 5]}
                      onValueChange={([value]) => handleScenarioChange({ numberOfFloors: value })}
                      min={1}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Shared Space Percentage */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Shared Space (%)</Label>
                      <span className="text-sm font-semibold text-slate-900">{scenario.sharedSpacePercentage || 20}%</span>
                    </div>
                    <Slider
                      value={[scenario.sharedSpacePercentage || 20]}
                      onValueChange={([value]) => handleScenarioChange({ sharedSpacePercentage: value })}
                      min={10}
                      max={40}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-slate-600">Corridors, stairs, lifts, and common areas</p>
                  </div>
                </>
              )}

              {(isSingleFamily || isMixed) && (
                <>
                  {/* Number of Units */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Number of Homes</Label>
                      <span className="text-sm font-semibold text-slate-900">{scenario.numberOfUnits || 50}</span>
                    </div>
                    <Slider
                      value={[scenario.numberOfUnits || 50]}
                      onValueChange={([value]) => handleScenarioChange({ numberOfUnits: value })}
                      min={5}
                      max={500}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Lot Size */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Lot Size (m²)</Label>
                      <span className="text-sm font-semibold text-slate-900">{scenario.lotSize || 200} m²</span>
                    </div>
                    <Slider
                      value={[scenario.lotSize || 200]}
                      onValueChange={([value]) => handleScenarioChange({ lotSize: value })}
                      min={100}
                      max={1000}
                      step={50}
                      className="w-full"
                    />
                  </div>

                  {/* House Size */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>House Size (m²)</Label>
                      <span className="text-sm font-semibold text-slate-900">{scenario.houseSize || 100} m²</span>
                    </div>
                    <Slider
                      value={[scenario.houseSize || 100]}
                      onValueChange={([value]) => handleScenarioChange({ houseSize: value })}
                      min={40}
                      max={300}
                      step={10}
                      className="w-full"
                    />
                  </div>
                </>
              )}

              {project.projectType === "mixed" && (
                <>
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <h3 className="font-semibold text-sm text-slate-900 mb-4">Mixed Development Split</h3>
                  </div>

                  {/* Apartment Units */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Apartment Units</Label>
                      <span className="text-sm font-semibold text-slate-900">{scenario.apartmentUnits || 100}</span>
                    </div>
                    <Slider
                      value={[scenario.apartmentUnits || 100]}
                      onValueChange={([value]) => handleScenarioChange({ apartmentUnits: value })}
                      min={10}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  {/* Single-Family Units */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Single-Family Units</Label>
                      <span className="text-sm font-semibold text-slate-900">{scenario.singleFamilyUnits || 50}</span>
                    </div>
                    <Slider
                      value={[scenario.singleFamilyUnits || 50]}
                      onValueChange={([value]) => handleScenarioChange({ singleFamilyUnits: value })}
                      min={5}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Unit Mix - Only for Apartments */}
          {isApartment && (
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-lg font-semibold text-slate-900">Unit Mix</CardTitle>
              <CardDescription className="text-sm">Distribution of unit types (must total 100%)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              {/* 1-Bedroom */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">1-Bedroom</Label>
                  <span className="text-xs font-semibold text-slate-900">{scenario.unitMix?.oneBedroom || 40}%</span>
                </div>
                <Slider
                  value={[scenario.unitMix?.oneBedroom || 40]}
                  onValueChange={([value]) => {
                    const remaining = 100 - value
                    const twoBedroomRatio =
                      (scenario.unitMix?.twoBedroom || 35) / ((scenario.unitMix?.twoBedroom || 35) + (scenario.unitMix?.threeBedroom || 25)) || 0.7
                    handleScenarioChange({
                      unitMix: {
                        oneBedroom: value,
                        twoBedroom: Math.round(remaining * twoBedroomRatio),
                        threeBedroom: Math.round(remaining * (1 - twoBedroomRatio)),
                      },
                    })
                  }}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* 2-Bedroom */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">2-Bedroom</Label>
                  <span className="text-xs font-semibold text-slate-900">{scenario.unitMix?.twoBedroom || 35}%</span>
                </div>
                <Slider
                  value={[scenario.unitMix?.twoBedroom || 35]}
                  onValueChange={([value]) => {
                    const remaining = 100 - value
                    const oneBedroomRatio =
                      (scenario.unitMix?.oneBedroom || 40) / ((scenario.unitMix?.oneBedroom || 40) + (scenario.unitMix?.threeBedroom || 25)) || 0.7
                    handleScenarioChange({
                      unitMix: {
                        oneBedroom: Math.round(remaining * oneBedroomRatio),
                        twoBedroom: value,
                        threeBedroom: Math.round(remaining * (1 - oneBedroomRatio)),
                      },
                    })
                  }}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* 3-Bedroom */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">3-Bedroom</Label>
                  <span className="text-xs font-semibold text-slate-900">{scenario.unitMix?.threeBedroom || 25}%</span>
                </div>
                <Slider
                  value={[scenario.unitMix?.threeBedroom || 25]}
                  onValueChange={([value]) => {
                    const remaining = 100 - value
                    const oneBedroomRatio =
                      (scenario.unitMix?.oneBedroom || 40) / ((scenario.unitMix?.oneBedroom || 40) + (scenario.unitMix?.twoBedroom || 35)) || 0.6
                    handleScenarioChange({
                      unitMix: {
                        oneBedroom: Math.round(remaining * oneBedroomRatio),
                        twoBedroom: Math.round(remaining * (1 - oneBedroomRatio)),
                        threeBedroom: value,
                      },
                    })
                  }}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="pt-1.5 border-t border-slate-200 mt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Total</span>
                  <span
                    className={`font-semibold ${
                      (scenario.unitMix?.oneBedroom || 40) + (scenario.unitMix?.twoBedroom || 35) + (scenario.unitMix?.threeBedroom || 25) === 100
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {(scenario.unitMix?.oneBedroom || 40) + (scenario.unitMix?.twoBedroom || 35) + (scenario.unitMix?.threeBedroom || 25)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Cost Configuration */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-lg font-semibold text-slate-900">Cost Configuration</CardTitle>
              <CardDescription className="text-slate-500">Construction and infrastructure costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Construction Cost Per SQM */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Construction Cost (per m²)</Label>
                  <span className="text-base font-bold text-slate-900">
                    ${scenario.constructionCostPerSqm.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[scenario.constructionCostPerSqm]}
                  onValueChange={([value]) => handleScenarioChange({ constructionCostPerSqm: value })}
                  min={200}
                  max={1500}
                  step={50}
                  className="w-full"
                />
              </div>

              {/* Finish Level */}
              <div className="space-y-2">
                <Label htmlFor="finishLevel" className="text-sm font-medium">Finish Level</Label>
                <Select
                  value={scenario.finishLevel}
                  onValueChange={(value: "basic" | "standard" | "improved") =>
                    handleScenarioChange({ finishLevel: value })
                  }
                >
                  <SelectTrigger id="finishLevel" className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (~$400/m²)</SelectItem>
                    <SelectItem value="standard">Standard (~$600/m²)</SelectItem>
                    <SelectItem value="improved">Improved (~$900/m²)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">Affects overall construction quality</p>
              </div>

              {/* Infrastructure Costs */}
              <div className="space-y-3">
                <Label className="text-sm font-medium block">Infrastructure Costs</Label>

                <div className="space-y-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <Label htmlFor="waterCost" className="font-medium text-slate-700 text-sm">
                      💧 Water
                    </Label>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-600 text-xs">$</span>
                      <Input
                        id="waterCost"
                        type="number"
                        value={scenario.infrastructureCosts.water}
                        onChange={(e) =>
                          handleScenarioChange({
                            infrastructureCosts: {
                              ...scenario.infrastructureCosts,
                              water: Number.parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-20 text-right font-semibold text-slate-900 border border-slate-300 rounded px-1.5 py-1 text-xs"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-sm">
                    <Label htmlFor="sewerCost" className="font-medium text-slate-700 text-sm">
                      🚰 Sewer
                    </Label>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-600 text-xs">$</span>
                      <Input
                        id="sewerCost"
                        type="number"
                        value={scenario.infrastructureCosts.sewer}
                        onChange={(e) =>
                          handleScenarioChange({
                            infrastructureCosts: {
                              ...scenario.infrastructureCosts,
                              sewer: Number.parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-20 text-right font-semibold text-slate-900 border border-slate-300 rounded px-1.5 py-1 text-xs"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-sm">
                    <Label htmlFor="roadsCost" className="font-medium text-slate-700 text-sm">
                      🛣️ Roads
                    </Label>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-600 text-xs">$</span>
                      <Input
                        id="roadsCost"
                        type="number"
                        value={scenario.infrastructureCosts.roads}
                        onChange={(e) =>
                          handleScenarioChange({
                            infrastructureCosts: {
                              ...scenario.infrastructureCosts,
                              roads: Number.parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-20 text-right font-semibold text-slate-900 border border-slate-300 rounded px-1.5 py-1 text-xs"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-sm">
                    <Label htmlFor="electricityCost" className="font-medium text-slate-700 text-sm">
                      ⚡ Electricity
                    </Label>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-600 text-xs">$</span>
                      <Input
                        id="electricityCost"
                        type="number"
                        value={scenario.infrastructureCosts.electricity}
                        onChange={(e) =>
                          handleScenarioChange({
                            infrastructureCosts: {
                              ...scenario.infrastructureCosts,
                              electricity: Number.parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-20 text-right font-semibold text-slate-900 border border-slate-300 rounded px-1.5 py-1 text-xs"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-300 pt-2 mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">Total Infrastructure</span>
                      <span className="font-bold text-blue-600">
                        ${(
                          scenario.infrastructureCosts.water +
                          scenario.infrastructureCosts.sewer +
                          scenario.infrastructureCosts.roads +
                          scenario.infrastructureCosts.electricity
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">
            Save Scenario
          </Button>
        </div>

        {/* Right Column: Unit Mix and Visualization & Results */}
        <div className="lg:col-span-7 space-y-8">
          <LayoutVisualization 
            scenario={scenario} 
            results={results} 
            roomSizes={{
              masterBedroom: 20,
              bedroom: 15,
              livingRoom: 30,
              kitchen: 15,
              bathroom: 10,
              hallway: 8,
            }}
          />
          {results && <ResultsPanel results={results} project={project} scenario={scenario} />}
        </div>
      </div>
    </div>
  )
}
