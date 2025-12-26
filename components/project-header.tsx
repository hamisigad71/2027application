"use client"

import type { Project, Scenario } from "@/lib/types"
import { MapPin, DollarSign, Users, Maximize2, Home, TrendingUp, Zap, Droplets, AlertCircle } from "lucide-react"
import { formatCurrency } from "@/lib/calculations"

interface ProjectHeaderProps {
  project: Project
  scenarios?: Scenario[]
}

export function ProjectHeader({ project, scenarios = [] }: ProjectHeaderProps) {
  const landSizeDisplay =
    project.landSizeUnit === "acres"
      ? `${project.landSize.toLocaleString()} acres (${(project.landSize * 4046.86).toLocaleString()} m²)`
      : `${project.landSize.toLocaleString()} m² (${(project.landSize / 10000).toFixed(2)} hectares)`

  const incomeGroupLabel = {
    low: "Low Income",
    "lower-middle": "Lower-Middle Income",
    middle: "Middle Income",
    mixed: "Mixed Income",
  }[project.targetIncomeGroup]

  // Calculate metrics from actual scenarios if they exist
  const hasScenarios = scenarios && scenarios.length > 0
  
  let totalUnits = 0
  let estimatedPopulation = 0
  let landSizeInSqm = project.landSizeUnit === "acres" ? project.landSize * 4046.86 : project.landSize
  let netDensity = 0

  if (hasScenarios) {
    // Sum up units from all scenarios
    scenarios.forEach((scenario) => {
      if (scenario.calculatedResults) {
        totalUnits += scenario.calculatedResults.totalUnits
        estimatedPopulation += scenario.calculatedResults.estimatedPopulation
      }
    })
    
    // Calculate density based on actual scenario units
    if (totalUnits > 0) {
      netDensity = Math.round(totalUnits / (landSizeInSqm / 10000))
    }
  }
  
  return (
    <header className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Title and Location */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-slate-600">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="text-lg">
                {project.location.city}, {project.location.country}
              </span>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Land Size */}
            <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300">
              <div className="h-2 bg-gradient-to-r from-slate-400 to-slate-500"></div>
              <div className="p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <Maximize2 className="h-5 w-5 text-slate-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Land</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-slate-500 font-medium">Size</p>
                  <p className="text-sm md:text-base font-bold text-slate-900 line-clamp-2">{landSizeDisplay}</p>
                </div>
              </div>
            </div>

            {/* Project Type */}
            <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300">
              <div className="h-2 bg-gradient-to-r from-slate-400 to-slate-500"></div>
              <div className="p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <Home className="h-5 w-5 text-slate-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Type</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-slate-500 font-medium">Project</p>
                  <p className="text-sm md:text-base font-bold text-slate-900 capitalize line-clamp-2">{project.projectType ? project.projectType.replace("-", " ") : "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Target Income */}
            <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300">
              <div className="h-2 bg-gradient-to-r from-slate-400 to-slate-500"></div>
              <div className="p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <Users className="h-5 w-5 text-slate-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Target</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-slate-500 font-medium">Income</p>
                  <p className="text-sm md:text-base font-bold text-slate-900 line-clamp-2">{incomeGroupLabel}</p>
                </div>
              </div>
            </div>

            {/* Budget Range */}
            <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300">
              <div className="h-2 bg-gradient-to-r from-slate-500 to-slate-600"></div>
              <div className="p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center group-hover:bg-slate-300 transition-colors">
                    <DollarSign className="h-5 w-5 text-slate-700" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Budget</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-slate-500 font-medium">Range</p>
                  <div className="space-y-0.5">
                    <p className="text-xs md:text-sm font-bold text-slate-900">{formatCurrency(project.budgetRange.min, project.budgetRange.currency)}</p>
                    <p className="text-xs md:text-sm font-bold text-slate-900">{formatCurrency(project.budgetRange.max, project.budgetRange.currency)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
