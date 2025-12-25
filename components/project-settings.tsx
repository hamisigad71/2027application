"use client"

import { useState } from "react"
import type { Project } from "@/lib/types"
import { projectStorage } from "@/lib/storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle, Save } from "lucide-react"

interface ProjectSettingsProps {
  project: Project
  onUpdate: () => void
}

export function ProjectSettings({ project, onUpdate }: ProjectSettingsProps) {
  const [settings, setSettings] = useState(project.customAssumptions || {})
  const [isSaving, setIsSaving] = useState(false)

  const handlePersonsPerUnitChange = (bedrooms: number, value: number) => {
    setSettings({
      ...settings,
      personsPerUnit: {
        ...(settings.personsPerUnit || {}),
        [`${bedrooms}Bedroom`]: value,
      } as any,
    })
  }

  const handleDensityThresholdChange = (level: string, value: number) => {
    setSettings({
      ...settings,
      densityThresholds: {
        ...(settings.densityThresholds || {}),
        [level]: value,
      } as any,
    })
  }

  const handleRoomSizeChange = (room: string, value: number) => {
    setSettings({
      ...settings,
      roomSizes: {
        ...(settings.roomSizes || {}),
        [room]: value,
      } as any,
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      projectStorage.update(project.id, {
        customAssumptions: settings,
      })
      onUpdate()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
        <AlertCircle className="h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-1">Custom Project Assumptions</p>
          <p>Override country defaults for this specific project. These values will be used in all scenarios unless overridden at the scenario level.</p>
        </div>
      </div>

      {/* Persons Per Unit */}
      <Card>
        <CardHeader>
          <CardTitle>Average Persons Per Unit</CardTitle>
          <CardDescription>Override country occupancy assumptions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>1-Bedroom Units</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[settings.personsPerUnit?.oneBedroom || 2.5]}
                  onValueChange={([value]) => handlePersonsPerUnitChange(1, value)}
                  min={1}
                  max={6}
                  step={0.5}
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-slate-900 w-12">
                  {settings.personsPerUnit?.oneBedroom || 2.5} people
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>2-Bedroom Units</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[settings.personsPerUnit?.twoBedroom || 3.5]}
                  onValueChange={([value]) => handlePersonsPerUnitChange(2, value)}
                  min={1}
                  max={6}
                  step={0.5}
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-slate-900 w-12">
                  {settings.personsPerUnit?.twoBedroom || 3.5} people
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>3-Bedroom Units</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[settings.personsPerUnit?.threeBedroom || 4.5]}
                  onValueChange={([value]) => handlePersonsPerUnitChange(3, value)}
                  min={1}
                  max={6}
                  step={0.5}
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-slate-900 w-12">
                  {settings.personsPerUnit?.threeBedroom || 4.5} people
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Density Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle>Density Classification Thresholds</CardTitle>
          <CardDescription>Units per hectare for each density level</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[
              { label: "Low Density (Upper Bound)", key: "low", defaultValue: 50 },
              { label: "Medium Density (Upper Bound)", key: "medium", defaultValue: 150 },
              { label: "High Density (Upper Bound)", key: "high", defaultValue: 300 },
              { label: "Very High Density (Upper Bound)", key: "veryHigh", defaultValue: 500 },
            ].map(({ label, key, defaultValue }) => (
              <div key={key} className="space-y-2">
                <Label>{label}</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[settings.densityThresholds?.[key as keyof typeof settings.densityThresholds] || defaultValue]}
                    onValueChange={([value]) => handleDensityThresholdChange(key, value)}
                    min={10}
                    max={1000}
                    step={10}
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-slate-900 w-20">
                    {settings.densityThresholds?.[key as keyof typeof settings.densityThresholds] || defaultValue} units/ha
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Room Sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Room Sizes for Visualization</CardTitle>
          <CardDescription>Used in layout visualization diagrams (m²)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Master Bedroom", key: "masterBedroom", defaultValue: 20 },
              { label: "Regular Bedroom", key: "bedroom", defaultValue: 15 },
              { label: "Living Room", key: "livingRoom", defaultValue: 30 },
              { label: "Kitchen", key: "kitchen", defaultValue: 15 },
              { label: "Bathroom", key: "bathroom", defaultValue: 10 },
              { label: "Hallway", key: "hallway", defaultValue: 8 },
            ].map(({ label, key, defaultValue }) => (
              <div key={key} className="space-y-2">
                <Label className="text-sm">{label}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={settings.roomSizes?.[key as keyof typeof settings.roomSizes] || defaultValue}
                    onChange={(e) => handleRoomSizeChange(key, parseFloat(e.target.value))}
                    min={1}
                    max={100}
                    className="h-9"
                  />
                  <span className="text-xs text-slate-500 w-6">m²</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Project Settings"}
        </Button>
      </div>
    </div>
  )
}
