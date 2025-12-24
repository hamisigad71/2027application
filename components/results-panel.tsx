"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ScenarioResults, Project } from "@/lib/types"
import { formatCurrency, formatNumber } from "@/lib/calculations"
import { AlertCircle, CheckCircle, AlertTriangle, Users, Home, Droplets } from "lucide-react"
import { CostBreakdownChart } from "./cost-breakdown-chart"

interface ResultsPanelProps {
  results: ScenarioResults
  project: Project
  scenario?: {
    constructionCostPerSqm: number
    infrastructureCosts: {
      water: number
      sewer: number
      roads: number
    }
  }
}

export function ResultsPanel({ results, project, scenario }: ResultsPanelProps) {
  const budgetStatusConfig = {
    under: {
      icon: AlertCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
      label: "Under Budget",
    },
    within: {
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      label: "Within Budget",
    },
    over: {
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      label: "Over Budget",
    },
  }

  const infrastructureStatusConfig = {
    ok: {
      icon: CheckCircle,
      color: "text-green-600",
      label: "Manageable",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-orange-600",
      label: "Moderate Load",
    },
    exceeds: {
      icon: AlertCircle,
      color: "text-red-600",
      label: "High Load",
    },
  }

  const budgetConfig = budgetStatusConfig[results.budgetStatus]
  const BudgetIcon = budgetConfig.icon

  const infraConfig = infrastructureStatusConfig[results.infrastructureStatus]
  const InfraIcon = infraConfig.icon

  return (
    <div className="space-y-6">
      {/* Cost Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center gap-3 p-3 rounded-lg ${budgetConfig.bg}`}>
            <BudgetIcon className={`h-5 w-5 ${budgetConfig.color}`} />
            <div className="flex-1">
              <div className="text-sm text-slate-600">Budget Status</div>
              <div className={`font-semibold ${budgetConfig.color}`}>{budgetConfig.label}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Project Cost</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(results.totalProjectCost, project.budgetRange.currency)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Cost per Unit</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(results.costPerUnit, project.budgetRange.currency)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Cost per Person</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(results.costPerPerson, project.budgetRange.currency)}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
              <span>Budget Range</span>
              <span>
                {formatCurrency(project.budgetRange.min, project.budgetRange.currency)} -{" "}
                {formatCurrency(project.budgetRange.max, project.budgetRange.currency)}
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  results.budgetStatus === "over"
                    ? "bg-red-500"
                    : results.budgetStatus === "within"
                      ? "bg-green-500"
                      : "bg-blue-500"
                }`}
                style={{
                  width: `${Math.min((results.totalProjectCost / project.budgetRange.max) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown Chart */}
      {scenario && <CostBreakdownChart results={results} project={project} scenario={scenario} />}

      {/* Infrastructure Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Infrastructure Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <InfraIcon className={`h-5 w-5 ${infraConfig.color}`} />
            <div className="flex-1">
              <div className="text-sm text-slate-600">Infrastructure Status</div>
              <div className={`font-semibold ${infraConfig.color}`}>{infraConfig.label}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Droplets className="h-4 w-4 text-slate-500" />
              <div className="flex-1">
                <div className="text-sm text-slate-600">Daily Water Demand</div>
                <div className="font-semibold text-slate-900">{formatNumber(results.dailyWaterDemand)} liters</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-4 w-4 flex items-center justify-center">
                <div className="h-3 w-3 bg-yellow-500 rounded-sm" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-600">Daily Electricity</div>
                <div className="font-semibold text-slate-900">{formatNumber(results.electricityDemand)} kWh</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-4 w-4 flex items-center justify-center">
                <div className="h-3 w-3 bg-slate-500 rounded-sm" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-600">Daily Waste</div>
                <div className="font-semibold text-slate-900">{formatNumber(results.wasteGeneration)} kg</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Population Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Population Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="text-sm text-slate-600">Total Population Housed</div>
              <div className="text-2xl font-semibold text-slate-900">{results.estimatedPopulation}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Home className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="text-sm text-slate-600">Average Household Size</div>
              <div className="text-2xl font-semibold text-slate-900">
                {(results.estimatedPopulation / results.totalUnits).toFixed(1)} people/unit
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
