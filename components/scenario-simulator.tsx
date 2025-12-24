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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Controls */}
        <div className="space-y-6">
          {/* Layout Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Layout Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Unit Size */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Unit Size (m²)</Label>
                  <span className="text-sm font-semibold text-slate-900">{scenario.unitSize} m²</span>
                </div>
                <Slider
                  value={[scenario.unitSize]}
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
                  <span className="text-sm font-semibold text-slate-900">{scenario.unitsPerFloor}</span>
                </div>
                <Slider
                  value={[scenario.unitsPerFloor]}
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
                  <span className="text-sm font-semibold text-slate-900">{scenario.numberOfFloors}</span>
                </div>
                <Slider
                  value={[scenario.numberOfFloors]}
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
                  <span className="text-sm font-semibold text-slate-900">{scenario.sharedSpacePercentage}%</span>
                </div>
                <Slider
                  value={[scenario.sharedSpacePercentage]}
                  onValueChange={([value]) => handleScenarioChange({ sharedSpacePercentage: value })}
                  min={10}
                  max={40}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-slate-600">Corridors, stairs, lifts, and common areas</p>
              </div>
            </CardContent>
          </Card>

          {/* Unit Mix */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Unit Mix</CardTitle>
              <CardDescription>Distribution of unit types (must total 100%)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 1-Bedroom */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>1-Bedroom</Label>
                  <span className="text-sm font-semibold text-slate-900">{scenario.unitMix.oneBedroom}%</span>
                </div>
                <Slider
                  value={[scenario.unitMix.oneBedroom]}
                  onValueChange={([value]) => {
                    const remaining = 100 - value
                    const twoBedroomRatio =
                      scenario.unitMix.twoBedroom / (scenario.unitMix.twoBedroom + scenario.unitMix.threeBedroom) || 0.7
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>2-Bedroom</Label>
                  <span className="text-sm font-semibold text-slate-900">{scenario.unitMix.twoBedroom}%</span>
                </div>
                <Slider
                  value={[scenario.unitMix.twoBedroom]}
                  onValueChange={([value]) => {
                    const remaining = 100 - value
                    const oneBedroomRatio =
                      scenario.unitMix.oneBedroom / (scenario.unitMix.oneBedroom + scenario.unitMix.threeBedroom) || 0.7
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>3-Bedroom</Label>
                  <span className="text-sm font-semibold text-slate-900">{scenario.unitMix.threeBedroom}%</span>
                </div>
                <Slider
                  value={[scenario.unitMix.threeBedroom]}
                  onValueChange={([value]) => {
                    const remaining = 100 - value
                    const oneBedroomRatio =
                      scenario.unitMix.oneBedroom / (scenario.unitMix.oneBedroom + scenario.unitMix.twoBedroom) || 0.6
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

              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Total</span>
                  <span
                    className={`font-semibold ${
                      scenario.unitMix.oneBedroom + scenario.unitMix.twoBedroom + scenario.unitMix.threeBedroom === 100
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {scenario.unitMix.oneBedroom + scenario.unitMix.twoBedroom + scenario.unitMix.threeBedroom}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cost Configuration</CardTitle>
              <CardDescription>Adjust construction and infrastructure costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Construction Cost Per SQM */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Construction Cost (per m²)</Label>
                  <span className="text-sm font-semibold text-slate-900">
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
                <Label htmlFor="finishLevel">Finish Level</Label>
                <Select
                  value={scenario.finishLevel}
                  onValueChange={(value: "basic" | "standard" | "improved") =>
                    handleScenarioChange({ finishLevel: value })
                  }
                >
                  <SelectTrigger id="finishLevel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (~$400/m²)</SelectItem>
                    <SelectItem value="standard">Standard (~$600/m²)</SelectItem>
                    <SelectItem value="improved">Improved (~$900/m²)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-600">Affects overall construction quality and costs</p>
              </div>

              {/* Infrastructure Costs */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <Label className="text-sm font-semibold">Infrastructure Costs</Label>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="waterCost" className="text-sm font-normal">
                      Water
                    </Label>
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
                      className="w-32 text-right"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="sewerCost" className="text-sm font-normal">
                      Sewer
                    </Label>
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
                      className="w-32 text-right"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="roadsCost" className="text-sm font-normal">
                      Roads
                    </Label>
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
                      className="w-32 text-right"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Total Infrastructure</span>
                    <span className="font-semibold text-slate-900">
                      $
                      {(
                        scenario.infrastructureCosts.water +
                        scenario.infrastructureCosts.sewer +
                        scenario.infrastructureCosts.roads
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">
            Save Scenario
          </Button>
        </div>

        {/* Right Column: Visualization & Results */}
        <div className="space-y-6">
          <LayoutVisualization scenario={scenario} results={results} />
          {results && <ResultsPanel results={results} project={project} scenario={scenario} />}
        </div>
      </div>
    </div>
  )
}
