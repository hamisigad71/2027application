"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Project, Scenario } from "@/lib/types"
import { Download, FileText } from "lucide-react"
import { costAssumptionsStorage } from "@/lib/storage"
import { calculateScenarioResults, formatCurrency, formatNumber } from "@/lib/calculations"

interface ProjectReportProps {
  project: Project
  scenarios: Scenario[]
}

export function ProjectReport({ project, scenarios }: ProjectReportProps) {
  const generateReport = () => {
    const costAssumptions = costAssumptionsStorage.get(project.location.country)
    const landSizeInSqm = project.landSizeUnit === "acres" ? project.landSize * 4046.86 : project.landSize

    // Generate report content
    let reportContent = `
SMART AFFORDABLE HOUSING PLANNING TOOL
PROJECT REPORT

=====================================
PROJECT OVERVIEW
=====================================

Project Name: ${project.name}
Location: ${project.location.city}, ${project.location.country}
Land Size: ${project.landSize.toLocaleString()} ${project.landSizeUnit === "acres" ? "acres" : "m²"}
Target Income Group: ${project.targetIncomeGroup}
Budget Range: ${formatCurrency(project.budgetRange.min, project.budgetRange.currency)} - ${formatCurrency(project.budgetRange.max, project.budgetRange.currency)}

=====================================
SCENARIO SUMMARY
=====================================

Total Scenarios: ${scenarios.length}

`

    scenarios.forEach((scenario, index) => {
      const results = calculateScenarioResults(scenario, project.budgetRange, landSizeInSqm, costAssumptions)

      reportContent += `
--- Scenario ${index + 1}: ${scenario.name} ---

Layout Configuration:
- Unit Size: ${scenario.unitSize} m²
- Units per Floor: ${scenario.unitsPerFloor}
- Number of Floors: ${scenario.numberOfFloors}
- Shared Space: ${scenario.sharedSpacePercentage}%

Unit Mix:
- 1-Bedroom: ${scenario.unitMix.oneBedroom}%
- 2-Bedroom: ${scenario.unitMix.twoBedroom}%
- 3-Bedroom: ${scenario.unitMix.threeBedroom}%

Results:
- Total Units: ${results.totalUnits}
- Estimated Population: ${results.estimatedPopulation}
- Built-up Area: ${Math.round(results.builtUpArea).toLocaleString()} m²
- Density: ${results.densityClassification}
- Land Coverage: ${results.landCoveragePercentage.toFixed(1)}%

Cost Analysis:
- Total Project Cost: ${formatCurrency(results.totalProjectCost, project.budgetRange.currency)}
- Cost per Unit: ${formatCurrency(results.costPerUnit, project.budgetRange.currency)}
- Cost per Person: ${formatCurrency(results.costPerPerson, project.budgetRange.currency)}
- Budget Status: ${results.budgetStatus}

Infrastructure Impact:
- Daily Water Demand: ${formatNumber(results.dailyWaterDemand)} liters
- Daily Electricity: ${formatNumber(results.electricityDemand)} kWh
- Daily Waste: ${formatNumber(results.wasteGeneration)} kg
- Infrastructure Status: ${results.infrastructureStatus}

`
    })

    reportContent += `
=====================================
END OF REPORT
=====================================

Generated: ${new Date().toLocaleString()}
`

    // Create and download file
    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${project.name.replace(/\s+/g, "_")}_Report.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Export Project Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">
          Generate a comprehensive report including all scenarios, calculations, and comparisons. This report can be
          shared with stakeholders and decision-makers.
        </p>

        <div className="space-y-2">
          <div className="text-sm text-slate-700">
            <strong>Report includes:</strong>
          </div>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-4">
            <li>Project overview and specifications</li>
            <li>All scenario configurations and results</li>
            <li>Cost analysis and budget status</li>
            <li>Population impact projections</li>
            <li>Infrastructure requirements</li>
          </ul>
        </div>

        <Button
          onClick={generateReport}
          className="w-full bg-primary hover:bg-primary/90"
          disabled={scenarios.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Report (TXT)
        </Button>

        {scenarios.length === 0 && (
          <p className="text-xs text-slate-500 text-center">Create at least one scenario to generate a report</p>
        )}
      </CardContent>
    </Card>
  )
}
