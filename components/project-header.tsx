"use client"

import type { Project } from "@/lib/types"
import { MapPin, DollarSign, Users, Maximize2 } from "lucide-react"
import { formatCurrency } from "@/lib/calculations"

interface ProjectHeaderProps {
  project: Project
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const landSizeDisplay =
    project.landSizeUnit === "acres"
      ? `${project.landSize.toLocaleString()} acres`
      : `${project.landSize.toLocaleString()} m²`

  const incomeGroupLabel = {
    low: "Low Income",
    "lower-middle": "Lower-Middle Income",
    middle: "Middle Income",
    mixed: "Mixed Income",
  }[project.targetIncomeGroup]

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">{project.name}</h1>
            <p className="text-slate-600 flex items-center gap-2 mt-2">
              <MapPin className="h-4 w-4" />
              {project.location.city}, {project.location.country}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Maximize2 className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-slate-600">Land Size</div>
                <div className="font-semibold text-slate-900">{landSizeDisplay}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-slate-600">Target Group</div>
                <div className="font-semibold text-slate-900">{incomeGroupLabel}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-slate-600">Budget Range</div>
                <div className="font-semibold text-slate-900">
                  {formatCurrency(project.budgetRange.min, project.budgetRange.currency)} -{" "}
                  {formatCurrency(project.budgetRange.max, project.budgetRange.currency)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
