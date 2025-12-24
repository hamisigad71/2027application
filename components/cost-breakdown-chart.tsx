"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ScenarioResults, Project } from "@/lib/types"
import { formatCurrency } from "@/lib/calculations"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface CostBreakdownChartProps {
  results: ScenarioResults
  project: Project
  scenario: {
    constructionCostPerSqm: number
    infrastructureCosts: {
      water: number
      sewer: number
      roads: number
    }
  }
}

export function CostBreakdownChart({ results, project, scenario }: CostBreakdownChartProps) {
  const constructionCost = results.builtUpArea * scenario.constructionCostPerSqm
  const infrastructureTotal =
    scenario.infrastructureCosts.water + scenario.infrastructureCosts.sewer + scenario.infrastructureCosts.roads

  const data = [
    { name: "Construction", value: constructionCost, color: "#1e40af" },
    { name: "Water", value: scenario.infrastructureCosts.water, color: "#3b82f6" },
    { name: "Sewer", value: scenario.infrastructureCosts.sewer, color: "#60a5fa" },
    { name: "Roads", value: scenario.infrastructureCosts.roads, color: "#93c5fd" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value, project.budgetRange.currency)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600">{item.name}</span>
              </div>
              <span className="font-semibold text-slate-900">
                {formatCurrency(item.value, project.budgetRange.currency)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
