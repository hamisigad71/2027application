"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "./auth-provider";
import { useToast } from "./toast-provider";
import { projectStorage } from "@/lib/storage";
import { getAvailableCountries } from "@/lib/country-data";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: () => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onProjectCreated,
}: CreateProjectDialogProps) {
  const { user } = useAuth();
  const { showSuccess } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    projectType: "apartment" as "apartment" | "single-family" | "mixed",
    city: "",
    countryCode: "",
    countryName: "",
    landSize: "",
    landSizeUnit: "sqm" as "sqm" | "acres",
    targetIncomeGroup: "low" as "low" | "lower-middle" | "middle" | "mixed",
    budgetMin: "",
    budgetMax: "",
    currency: "USD",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;
    if (!formData.countryCode) {
      alert("Please select a country");
      return;
    }

    projectStorage.create({
      userId: user.id,
      projectType: formData.projectType,
      name: formData.name,
      location: {
        city: formData.city,
        country: formData.countryName,
        countryCode: formData.countryCode,
      },
      landSize: Number.parseFloat(formData.landSize),
      landSizeUnit: formData.landSizeUnit,
      targetIncomeGroup: formData.targetIncomeGroup,
      budgetRange: {
        min: Number.parseFloat(formData.budgetMin),
        max: Number.parseFloat(formData.budgetMax),
        currency: formData.currency,
      },
    });

    showSuccess(`Project "${formData.name}" created successfully! 🎉`);

    // Reset form
    setFormData({
      name: "",
      projectType: "apartment",
      city: "",
      countryCode: "",
      countryName: "",
      landSize: "",
      landSizeUnit: "sqm",
      targetIncomeGroup: "low",
      budgetMin: "",
      budgetMax: "",
      currency: "USD",
    });

    onProjectCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Housing Project</DialogTitle>
          <DialogDescription>
            Enter the basic details for your affordable housing project. You'll
            be able to create scenarios and simulations after creating the
            project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="e.g., Riverside Affordable Housing"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Project Type */}
          <div className="space-y-2">
            <Label htmlFor="projectType">Housing Type</Label>
            <Select
              value={formData.projectType}
              onValueChange={(value: any) =>
                setFormData({ ...formData, projectType: value })
              }
            >
              <SelectTrigger id="projectType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">
                  Multi-Unit Apartments (High Density)
                </SelectItem>
                <SelectItem value="single-family">
                  Single-Family Homes (Low Density)
                </SelectItem>
                <SelectItem value="mixed">
                  Mixed Development (Apartments + Single-Family)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="e.g., Nairobi"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={formData.countryCode}
                onValueChange={(code) => {
                  const country = getAvailableCountries().find(c => c.code === code)
                  setFormData({ 
                    ...formData, 
                    countryCode: code,
                    countryName: country?.name || ""
                  })
                }}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableCountries().map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.region})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Land Size */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="landSize">Land Size</Label>
              <Input
                id="landSize"
                type="number"
                step="0.01"
                placeholder="e.g., 10000"
                value={formData.landSize}
                onChange={(e) =>
                  setFormData({ ...formData, landSize: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landSizeUnit">Unit</Label>
              <Select
                value={formData.landSizeUnit}
                onValueChange={(value: "sqm" | "acres") =>
                  setFormData({ ...formData, landSizeUnit: value })
                }
              >
                <SelectTrigger id="landSizeUnit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sqm">Square Meters (m²)</SelectItem>
                  <SelectItem value="acres">Acres</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Target Income Group */}
          <div className="space-y-2">
            <Label htmlFor="targetIncomeGroup">Target Income Group</Label>
            <Select
              value={formData.targetIncomeGroup}
              onValueChange={(value: any) =>
                setFormData({ ...formData, targetIncomeGroup: value })
              }
            >
              <SelectTrigger id="targetIncomeGroup">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Income</SelectItem>
                <SelectItem value="lower-middle">
                  Lower-Middle Income
                </SelectItem>
                <SelectItem value="middle">Middle Income</SelectItem>
                <SelectItem value="mixed">Mixed Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget Range */}
          <div className="space-y-4">
            <Label>Budget Range</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Min (e.g., 500000)"
                  value={formData.budgetMin}
                  onChange={(e) =>
                    setFormData({ ...formData, budgetMin: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Max (e.g., 2000000)"
                  value={formData.budgetMax}
                  onChange={(e) =>
                    setFormData({ ...formData, budgetMax: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    setFormData({ ...formData, currency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="KES">KES</SelectItem>
                    <SelectItem value="NGN">NGN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
