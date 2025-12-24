"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Project, Scenario } from "@/lib/types"
import { calculateDemandForecast, formatNumber } from "@/lib/calculations"
import { TrendingUp, Users, Home, AlertTriangle, CheckCircle } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { costAssumptionsStorage } from "@/lib/storage"
import { calculateScenarioResults } from "@/lib/calculations"

interface DemandForecastingProps {
  project: Project
  scenarios: Scenario[]
}

export function DemandForecasting({ project, scenarios }: DemandForecastingProps) {
  const [currentPopulation, setCurrentPopulation] = useState(100000)
  const [annualGrowthRate, setAnnualGrowthRate] = useState(2.5)
  const [timeHorizon, setTimeHorizon] = useState<5 | 10 | 20>(10)
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0]?.id || "")

  // Calculate forecast
  const forecast = useMemo(() => {
    const avgHouseholdSize = 3.5
    const currentUnits = 0

    return calculateDemandForecast(currentPopulation, annualGrowthRate, timeHorizon, avgHouseholdSize, currentUnits)
  }, [currentPopulation, annualGrowthRate, timeHorizon])

  // Get selected scenario data
  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId)
  const scenarioCapacity = useMemo(() => {
    if (!selectedScenario) return null

    const costAssumptions = costAssumptionsStorage.get(project.location.country)
    const landSizeInSqm = project.landSizeUnit === "acres" ? project.landSize * 4046.86 : project.landSize

    const results = calculateScenarioResults(selectedScenario, project.budgetRange, landSizeInSqm, costAssumptions)

    return {
      units: results.totalUnits,
      population: results.estimatedPopulation,
    }
  }, [selectedScenario, project])

  // Prepare chart data
  const chartData = forecast?.map((projection) => ({
    year: `Year ${projection.year}`,
    population: projection.population,
    demand: projection.housingDemand,
    supply: scenarioCapacity?.units || 0,
    gap: projection.housingDemand - (scenarioCapacity?.units || 0),
  }))

  const finalYear = forecast?.[forecast.length - 1]
  const finalDemand = finalYear?.housingDemand || 0
  const finalGap = finalYear?.surplusShortfall || 0
  const shortfall = finalGap < 0

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Demand Forecasting</CardTitle>
          <CardDescription>Project future housing demand based on population growth trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Population */}
            <div className="space-y-3">
              <Label htmlFor="currentPop">Current Population</Label>
              <Input
                id="currentPop"
                type="number"
                value={currentPopulation}
                onChange={(e) => setCurrentPopulation(Number.parseInt(e.target.value) || 0)}
                placeholder="e.g., 100000"
              />
              <p className="text-xs text-slate-600">Total population in the target area</p>
            </div>

            {/* Time Horizon */}
            <div className="space-y-3">
              <Label htmlFor="timeHorizon">Time Horizon</Label>
              <Select
                value={timeHorizon.toString()}
                onValueChange={(value) => setTimeHorizon(Number.parseInt(value) as 5 | 10 | 20)}
              >
                <SelectTrigger id="timeHorizon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Years</SelectItem>
                  <SelectItem value="10">10 Years</SelectItem>
                  <SelectItem value="20">20 Years</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-600">Planning period for projections</p>
            </div>

            {/* Annual Growth Rate */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <Label>Annual Growth Rate (%)</Label>
                <span className="text-sm font-semibold text-slate-900">{annualGrowthRate.toFixed(1)}%</span>
              </div>
              <Slider
                value={[annualGrowthRate]}
                onValueChange={([value]) => setAnnualGrowthRate(value)}
                min={0}
                max={10}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-slate-600">Expected annual population growth rate</p>
            </div>

            {/* Compare with Scenario */}
            {scenarios.length > 0 && (
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="compareScenario">Compare with Scenario</Label>
                <Select value={selectedScenarioId} onValueChange={setSelectedScenarioId}>
                  <SelectTrigger id="compareScenario">
                    <SelectValue placeholder="Select a scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-600">See how your scenario meets projected demand</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Projections */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Future Population</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-semibold text-slate-900">{formatNumber(finalYear?.population || 0)}</div>
                <div className="text-xs text-slate-600">in {timeHorizon} years</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Housing Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Home className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-semibold text-slate-900">{formatNumber(finalDemand)} units</div>
                <div className="text-xs text-slate-600">projected need</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Scenario Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-semibold text-slate-900">
                  {formatNumber(scenarioCapacity?.units || 0)} units
                </div>
                <div className="text-xs text-slate-600">from selected scenario</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={shortfall ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">{shortfall ? "Shortfall" : "Surplus"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {shortfall ? (
                <AlertTriangle className="h-8 w-8 text-red-600" />
              ) : (
                <CheckCircle className="h-8 w-8 text-green-600" />
              )}
              <div>
                <div className={`text-2xl font-semibold ${shortfall ? "text-red-900" : "text-green-900"}`}>
                  {formatNumber(Math.abs(finalGap))} units
                </div>
                <div className="text-xs text-slate-600">{shortfall ? "additional needed" : "extra capacity"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Population & Demand Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatNumber(value)} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="population"
                  stackId="1"
                  stroke="#1e40af"
                  fill="#1e40af"
                  fillOpacity={0.6}
                  name="Population"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Demand vs Supply Chart */}
      {scenarioCapacity && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Housing Demand vs Scenario Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="demand"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Housing Demand (units)"
                  />
                  <Line
                    type="monotone"
                    dataKey="supply"
                    stroke="#22c55e"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Scenario Supply (units)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Projections Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Year-by-Year Projections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Year</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Population</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Housing Demand</th>
                  {scenarioCapacity && (
                    <>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Scenario Supply</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Gap</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {forecast?.map((projection) => {
                  const gap = projection.housingDemand - (scenarioCapacity?.units || 0)
                  const isShortfall = gap > 0

                  return (
                    <tr key={projection.year}>
                      <td className="py-3 px-4 text-sm text-slate-900 font-medium">Year {projection.year}</td>
                      <td className="text-right py-3 px-4 text-sm text-slate-900">
                        {formatNumber(projection.population)}
                      </td>
                      <td className="text-right py-3 px-4 text-sm text-slate-900">
                        {formatNumber(projection.housingDemand)}
                      </td>
                      {scenarioCapacity && (
                        <>
                          <td className="text-right py-3 px-4 text-sm text-slate-900">
                            {formatNumber(scenarioCapacity.units)}
                          </td>
                          <td
                            className={`text-right py-3 px-4 text-sm font-semibold ${isShortfall ? "text-red-600" : "text-green-600"}`}
                          >
                            {isShortfall ? "+" : ""}
                            {formatNumber(gap)}
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {scenarioCapacity && shortfall && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Planning Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <p>
              Based on your projections, the selected scenario will have a shortfall of{" "}
              <strong>{formatNumber(Math.abs(finalGap))} housing units</strong> by year {timeHorizon}.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Consider increasing building density or adding more floors to meet demand</li>
              <li>Plan for phased development with multiple projects over time</li>
              <li>Explore additional land parcels in the surrounding area</li>
              <li>Coordinate with regional housing authorities for comprehensive planning</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
