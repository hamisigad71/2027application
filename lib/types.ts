// Core TypeScript interfaces for the application

export interface User {
  id: string
  email: string
  name: string
  organization?: string
  role?: string
  phone?: string
  country?: string
  createdAt: string
}

export interface Project {
  id: string
  userId: string
  name: string
  location: {
    city: string
    country: string
  }
  landSize: number // in square meters
  landSizeUnit: "sqm" | "acres"
  targetIncomeGroup: "low" | "lower-middle" | "middle" | "mixed"
  budgetRange: {
    min: number
    max: number
    currency: string
  }
  createdAt: string
  updatedAt: string
}

export interface Scenario {
  id: string
  projectId: string
  name: string

  // Layout parameters
  unitSize: number // sqm per unit
  unitsPerFloor: number
  numberOfFloors: number
  unitMix: {
    oneBedroom: number // percentage
    twoBedroom: number // percentage
    threeBedroom: number // percentage
  }
  sharedSpacePercentage: number // percentage for corridors, stairs, lifts

  // Cost parameters
  constructionCostPerSqm: number
  infrastructureCosts: {
    water: number
    sewer: number
    roads: number
  }
  finishLevel: "basic" | "standard" | "improved"

  // Calculated results (cached)
  calculatedResults?: ScenarioResults

  createdAt: string
  updatedAt: string
}

export interface ScenarioResults {
  totalUnits: number
  estimatedPopulation: number
  builtUpArea: number
  landCoveragePercentage: number
  densityClassification: "low" | "medium" | "high" | "very-high"

  // Cost results
  totalProjectCost: number
  costPerUnit: number
  costPerPerson: number
  budgetStatus: "under" | "within" | "over"

  // Infrastructure impact
  dailyWaterDemand: number // liters
  electricityDemand: number // kWh per day
  wasteGeneration: number // kg per day
  infrastructureStatus: "ok" | "warning" | "exceeds"
}

export interface DemandForecast {
  projectId: string
  currentPopulation: number
  annualGrowthRate: number // percentage
  timeHorizon: 5 | 10 | 20 // years

  // Calculated projections
  projections?: {
    year: number
    population: number
    housingDemand: number
    surplusShortfall: number
  }[]
}

export interface CostAssumptions {
  country: string

  // Construction costs (per sqm)
  constructionCosts: {
    basic: number
    standard: number
    improved: number
  }

  // Infrastructure unit costs
  waterPerConnection: number
  sewerPerConnection: number
  roadsPerMeter: number

  // Occupancy assumptions
  personsPerUnit: {
    oneBedroom: number
    twoBedroom: number
    threeBedroom: number
  }

  // Infrastructure consumption per person per day
  waterLitersPerPerson: number
  electricityKwhPerPerson: number
  wasteKgPerPerson: number
}
