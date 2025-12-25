"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Project } from "@/lib/types"
import { MapPin, MoreVertical, Trash2, ArrowRight } from "lucide-react"
import { formatCurrency } from "@/lib/calculations"
import Link from "next/link"

interface ProjectCardProps {
  project: Project
  onDelete: (projectId: string) => void
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    if (showDeleteConfirm) {
      // Second click - actually delete
      onDelete(project.id)
    } else {
      // First click - show confirmation
      setShowDeleteConfirm(true)
      setTimeout(() => setShowDeleteConfirm(false), 3000)
    }
  }

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

  const incomeGroupColor = {
    low: "bg-emerald-100 text-emerald-800 border-emerald-200",
    "lower-middle": "bg-blue-100 text-blue-800 border-blue-200",
    middle: "bg-violet-100 text-violet-800 border-violet-200",
    mixed: "bg-amber-100 text-amber-800 border-amber-200",
  }[project.targetIncomeGroup]

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-slate-900 group-hover:text-blue-900 transition-colors">
              {project.name}
            </CardTitle>
            <div className="flex items-center gap-1 mt-2 text-slate-600">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-sm">
                {project.location.city}, {project.location.country}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.preventDefault()
                  handleDelete()
                }}
                className={`${showDeleteConfirm ? "text-red-600 bg-red-50" : "text-destructive"} cursor-pointer`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {showDeleteConfirm ? "⚠️ Click again to confirm" : "Delete Project"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Land Size</span>
            <span className="font-semibold text-slate-900">{landSizeDisplay}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Target Group</span>
            <Badge variant="secondary" className={`text-xs font-medium border ${incomeGroupColor}`}>
              {incomeGroupLabel}
            </Badge>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-600 font-medium">Budget Range</span>
            <div className="text-right">
              <div className="font-semibold text-slate-900 text-xs">
                {formatCurrency(project.budgetRange.min, project.budgetRange.currency)}
              </div>
              <div className="text-slate-500 text-xs">
                to {formatCurrency(project.budgetRange.max, project.budgetRange.currency)}
              </div>
            </div>
          </div>
        </div>

        <Link href={`/project/${project.id}`} className="block">
          <Button className="w-full bg-blue-900 hover:bg-blue-800 group/btn shadow-sm">
            <span>Open Project</span>
            <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
