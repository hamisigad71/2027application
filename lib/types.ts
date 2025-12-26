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
  projectType: "apartment" | "single-family" | "mixed"
  location: {
    city: string
    country: string
    countryCode?: string  // ISO country code for data lookups
  }
  landSize: number // in square meters
  landSizeUnit: "sqm" | "acres"
  targetIncomeGroup: "low" | "lower-middle" | "middle" | "mixed"
  budgetRange: {
    min: number
    max: number
    currency: string
  }
  // Project-level custom assumptions (override country defaults)
  customAssumptions?: {
    personsPerUnit?: {
      oneBedroom?: number
      twoBedroom?: number
      threeBedroom?: number
    }
    densityThresholds?: {
      low: number      // units per hectare upper bound
      medium: number   // units per hectare upper bound
      high: number     // units per hectare upper bound
      veryHigh: number // units per hectare upper bound
    }
    infrastructureWarningLevels?: {
      waterDemandM3: number      // Daily water in m³
      populationCount: number     // Population threshold
      warningWaterDemandM3: number
      warningPopulation: number
    }
    roomSizes?: {
      masterBedroom: number    // m²
      bedroom: number          // m²
      livingRoom: number       // m²
      kitchen: number          // m²
      bathroom: number         // m²
      hallway: number          // m²
    }
  }
  createdAt: string
  updatedAt: string
}

export interface Scenario {
  id: string
  projectId: string
  projectType: "apartment" | "single-family" | "mixed" // Link to project type
  name: string

  // Apartment-specific parameters
  unitSize?: number // sqm per unit
  unitsPerFloor?: number
  numberOfFloors?: number
  unitMix?: {
    oneBedroom: number // percentage
    twoBedroom: number // percentage
    threeBedroom: number // percentage
  }
  sharedSpacePercentage?: number // percentage for corridors, stairs, lifts

  // Single-family specific parameters
  numberOfUnits?: number // Total single-family homes
  lotSize?: number // sqm per lot
  houseSize?: number // sqm of built-up area per house

  // Mixed-use parameters (combines both apartment and single-family)
  apartmentUnits?: number
  singleFamilyUnits?: number
  apartmentFloors?: number
  apartmentUnitsPerFloor?: number

  // Cost parameters
  constructionCostPerSqm: number
  infrastructureCosts: {
    water: number
    sewer: number
    roads: number
    electricity: number
  }
  finishLevel: "basic" | "standard" | "improved"

  // Scenario-level custom assumptions (override project/country defaults)
  customAssumptions?: {
    personsPerUnit?: {
      oneBedroom?: number
      twoBedroom?: number
      threeBedroom?: number
    }
    singleFamilyPersonsPerUnit?: number
  }

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

  // Single-family occupancy
  singleFamilyPersonsPerUnit: number

  // Infrastructure consumption per person per day
  waterLitersPerPerson: number
  electricityKwhPerPerson: number
  wasteKgPerPerson: number

  // Density thresholds (units per hectare)
  densityThresholds: {
    low: number      // upper bound for low density
    medium: number   // upper bound for medium density
    high: number     // upper bound for high density
    veryHigh: number // everything above this is very-high
  }

  // Infrastructure warning thresholds
  infrastructureWarningLevels: {
    waterDemandExceeds: number       // m³ per day (exceeds threshold)
    waterDemandWarning: number       // m³ per day (warning threshold)
    populationExceeds: number        // population count (exceeds)
    populationWarning: number        // population count (warning)
  }

  // Room sizes for layout visualization (m²)
  roomSizes: {
    masterBedroom: number
    bedroom: number
    livingRoom: number
    kitchen: number
    bathroom: number
    hallway: number
  }
}

// Home Configurator Types - for individual homeowners
export interface HomeBuilderConfig {
  id: string
  userId: string
  country: string
  countryCode: string
  landSize: number // in square meters
  budget: number // total budget in USD
  style: "basic" | "standard" | "luxury" | "modern" | "traditional"
  sizePreference: "small" | "medium" | "large" | "spacious"
  features: {
    solarPanels: boolean
    smartHome: boolean
    airConditioning: boolean
    swimmingPool: boolean
    garage: boolean
    garden: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface HomeSpecification {
  totalBuildingArea: number // m²
  bedrooms: number
  bathrooms: number
  livingArea: number // m²
  kitchenArea: number // m²
  
  // Cost breakdown
  buildingCost: number // total construction cost
  costPerSqm: number
  infrastructureCost: number
  featuresCost: number // additional features
  laborCost: number
  totalCost: number
  
  // Maintenance and operations
  annualMaintenanceCost: number
  monthlyUtilitiesCost: number
  propertyTaxAnnual: number
  insuranceAnnual: number
  
  // Timeline
  estimatedTimelineMonths: number
  
  // Room breakdown
  roomBreakdown: {
    room: string
    area: number // m²
    description: string
  }[]
  
  // Features included
  includedFeatures: {
    feature: string
    cost: number
    description: string
  }[]
  
  // Budget analysis
  remainingBudget: number
  percentageUsed: number
}

export interface HomeBuilderResult {
  config: HomeBuilderConfig
  specification: HomeSpecification
  visualization: {
    lotSize: number
    houseSize: number
    coverage: number // percentage of lot
  }
}
