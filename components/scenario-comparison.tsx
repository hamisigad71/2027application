"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Scenario, Project } from "@/lib/types"
import { costAssumptionsStorage } from "@/lib/storage"
import { calculateScenarioResults, formatCurrency, formatNumber } from "@/lib/calculations"
import { Home, Users, DollarSign, TrendingUp, Droplets, Building2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ScenarioComparisonProps {
  scenarios: Scenario[]
  project: Project
}

export function ScenarioComparison({ scenarios, project }: ScenarioComparisonProps) {
  const [scenario1Id, setScenario1Id] = useState<string>(scenarios[0]?.id || "defaultScenario1")
  const [scenario2Id, setScenario2Id] = useState<string>(scenarios[1]?.id || "defaultScenario2")
  const [scenario3Id, setScenario3Id] = useState<string>(scenarios[2]?.id || "defaultScenario3")

  const costAssumptions = costAssumptionsStorage.get(project.location.country)
  const landSizeInSqm = project.landSizeUnit === "acres" ? project.landSize * 4046.86 : project.landSize

  const getScenarioWithResults = (scenarioId: string) => {
    const scenario = scenarios.find((s) => s.id === scenarioId)
    if (!scenario) return null

    const results = calculateScenarioResults(scenario, project.budgetRange, landSizeInSqm, costAssumptions)
    return { scenario, results }
  }

  const scenario1Data = scenario1Id ? getScenarioWithResults(scenario1Id) : null
  const scenario2Data = scenario2Id ? getScenarioWithResults(scenario2Id) : null
  const scenario3Data = scenario3Id ? getScenarioWithResults(scenario3Id) : null

  const comparisonData = [scenario1Data, scenario2Data, scenario3Data].filter(Boolean)

  // Prepare chart data
  const chartData = comparisonData.map((data) => ({
    name: data!.scenario.name,
    units: data!.results.totalUnits,
    population: data!.results.estimatedPopulation,
    cost: data!.results.totalProjectCost / 1000000, // Convert to millions
    costPerUnit: data!.results.costPerUnit / 1000, // Convert to thousands
  }))

  const densityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    "very-high": "bg-red-100 text-red-800",
  }

  const budgetColors = {
    under: "text-blue-600",
    within: "text-green-600",
    over: "text-red-600",
  }

  const infrastructureColors = {
    ok: "text-green-600",
    warning: "text-orange-600",
    exceeds: "text-red-600",
  }

  return (
    <div className="space-y-6">
      {/* Selection Card */}
      <Card>
        <CardHeader>
          <CardTitle>Compare Scenarios</CardTitle>
          <CardDescription>Select up to 3 scenarios to compare side-by-side</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scenario1">Scenario 1</Label>
              <Select value={scenario1Id} onValueChange={setScenario1Id}>
                <SelectTrigger id="scenario1">
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scenario2">Scenario 2</Label>
              <Select value={scenario2Id} onValueChange={setScenario2Id}>
                <SelectTrigger id="scenario2">
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {scenarios.map((s) => (
                    <SelectItem key={s.id} value={s.id} disabled={s.id === scenario1Id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scenario3">Scenario 3</Label>
              <Select value={scenario3Id} onValueChange={setScenario3Id}>
                <SelectTrigger id="scenario3">
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {scenarios.map((s) => (
                    <SelectItem key={s.id} value={s.id} disabled={s.id === scenario1Id || s.id === scenario2Id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Comparisons */}
      {chartData.length >= 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Units & Population</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="units" fill="#1e40af" name="Total Units" />
                    <Bar dataKey="population" fill="#3b82f6" name="Population" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number, name: string) => [value.toFixed(2), name]} />
                    <Legend />
                    <Bar dataKey="cost" fill="#1e40af" name="Total Cost (M)" />
                    <Bar dataKey="costPerUnit" fill="#60a5fa" name="Cost/Unit (K)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Metric</th>
                  {comparisonData.map((data) => (
                    <th key={data!.scenario.id} className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                      {data!.scenario.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Layout Metrics */}
                <tr className="bg-slate-50">
                  <td colSpan={comparisonData.length + 1} className="py-2 px-4 text-xs font-semibold text-slate-600">
                    LAYOUT
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Total Units
                  </td>
                  {comparisonData.map((data) => (
                    <td key={data!.scenario.id} className="text-right py-3 px-4 font-semibold text-slate-900">
                      {data!.results.totalUnits}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Floors
                  </td>
                  {comparisonData.map((data) => (
                    <td key={data!.scenario.id} className="text-right py-3 px-4 font-semibold text-slate-900">
                      {data!.scenario.numberOfFloors}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600">Density Classification</td>
                  {comparisonData.map((data) => (
                    <td key={data!.scenario.id} className="text-right py-3 px-4">
                      <Badge className={`${densityColors[data!.results.densityClassification]} border-none`}>
                        {data!.results.densityClassification.replace("-", " ")}
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Population Metrics */}
                <tr className="bg-slate-50">
                  <td colSpan={comparisonData.length + 1} className="py-2 px-4 text-xs font-semibold text-slate-600">
                    POPULATION
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Population
                  </td>
                  {comparisonData.map((data) => (
                    <td key={data!.scenario.id} className="text-right py-3 px-4 font-semibold text-slate-900">
                      {formatNumber(data!.results.estimatedPopulation)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600">People per Unit</td>
                  {comparisonData.map((data) => (
                    <td key={data!.scenario.id} className="text-right py-3 px-4 font-semibold text-slate-900">
                      {(data!.results.estimatedPopulation / data!.results.totalUnits).toFixed(1)}
                    </td>
                  ))}
                </tr>

                {/* Cost Metrics */}
                <tr className="bg-slate-50">
                  <td colSpan={comparisonData.length + 1} className="py-2 px-4 text-xs font-semibold text-slate-600">
                    COSTS
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Project Cost
                  </td>
                  {comparisonData.map((data) => (
                    <td
                      key={data!.scenario.id}
                      className={`text-right py-3 px-4 font-semibold ${budgetColors[data!.results.budgetStatus]}`}
                    >
                      {formatCurrency(data!.results.totalProjectCost, project.budgetRange.currency)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600">Cost per Unit</td>
                  {comparisonData.map((data) => (
                    <td key={data!.scenario.id} className="text-right py-3 px-4 font-semibold text-slate-900">
                      {formatCurrency(data!.results.costPerUnit, project.budgetRange.currency)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Cost per Person
                  </td>
                  {comparisonData.map((data) => (
                    <td key={data!.scenario.id} className="text-right py-3 px-4 font-semibold text-slate-900">
                      {formatCurrency(data!.results.costPerPerson, project.budgetRange.currency)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600">Budget Status</td>
                  {comparisonData.map((data) => (
                    <td
                      key={data!.scenario.id}
                      className={`text-right py-3 px-4 font-semibold ${budgetColors[data!.results.budgetStatus]}`}
                    >
                      {data!.results.budgetStatus.charAt(0).toUpperCase() + data!.results.budgetStatus.slice(1)}
                    </td>
                  ))}
                </tr>

                {/* Infrastructure Metrics */}
                <tr className="bg-slate-50">
                  <td colSpan={comparisonData.length + 1} className="py-2 px-4 text-xs font-semibold text-slate-600">
                    INFRASTRUCTURE
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    Daily Water Demand
                  </td>
                  {comparisonData.map((data) => (
                    <td key={data!.scenario.id} className="text-right py-3 px-4 font-semibold text-slate-900">
                      {formatNumber(data!.results.dailyWaterDemand)} L
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600">Daily Electricity</td>
                  {comparisonData.map((data) => (
                    <td key={data!.scenario.id} className="text-right py-3 px-4 font-semibold text-slate-900">
                      {formatNumber(data!.results.electricityDemand)} kWh
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600">Infrastructure Status</td>
                  {comparisonData.map((data) => (
                    <td
                      key={data!.scenario.id}
                      className={`text-right py-3 px-4 font-semibold ${infrastructureColors[data!.results.infrastructureStatus]}`}
                    >
                      {data!.results.infrastructureStatus.charAt(0).toUpperCase() +
                        data!.results.infrastructureStatus.slice(1)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Best Option Analysis */}
      {comparisonData.length >= 2 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Quick Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <div className="text-sm text-slate-600 mb-1">Most Affordable</div>
                <div className="font-semibold text-slate-900">
                  {comparisonData.sort((a, b) => a!.results.costPerPerson - b!.results.costPerPerson)[0]!.scenario.name}
                </div>
                <div className="text-xs text-slate-500 mt-1">Lowest cost per person housed</div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="text-sm text-slate-600 mb-1">Highest Capacity</div>
                <div className="font-semibold text-slate-900">
                  {
                    comparisonData.sort((a, b) => b!.results.estimatedPopulation - a!.results.estimatedPopulation)[0]!
                      .scenario.name
                  }
                </div>
                <div className="text-xs text-slate-500 mt-1">Maximum population housed</div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="text-sm text-slate-600 mb-1">Best Balance</div>
                <div className="font-semibold text-slate-900">
                  {comparisonData.filter((d) => d!.results.budgetStatus === "within")[0]?.scenario.name ||
                    comparisonData[0]!.scenario.name}
                </div>
                <div className="text-xs text-slate-500 mt-1">Within budget with good density</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
