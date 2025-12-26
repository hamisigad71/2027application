// Core calculation engine for housing planning

import type { Scenario, ScenarioResults, CostAssumptions, DemandForecast } from "./types"

/**
 * Calculate all metrics for a scenario
 */
export function calculateScenarioResults(
  scenario: Scenario,
  projectBudget: { min: number; max: number },
  landSize: number,
  costAssumptions: CostAssumptions,
): ScenarioResults {
  let totalUnits = 0
  let estimatedPopulation = 0
  let builtUpArea = 0

  // Use custom assumptions if provided (scenario level > project level > country defaults)
  const personsPerUnit = scenario.customAssumptions?.personsPerUnit || costAssumptions.personsPerUnit
  const singleFamilyPersons = scenario.customAssumptions?.singleFamilyPersonsPerUnit || costAssumptions.singleFamilyPersonsPerUnit

  // Calculate based on project type
  if (scenario.projectType === "apartment") {
    // Apartment calculations - REQUIRE all values to be provided
    if (!scenario.unitsPerFloor || !scenario.numberOfFloors) {
      throw new Error("Apartment scenarios require unitsPerFloor and numberOfFloors")
    }
    
    totalUnits = scenario.unitsPerFloor * scenario.numberOfFloors

    // Use provided unit mix percentages (no defaults)
    if (!scenario.unitMix) {
      throw new Error("Apartment scenarios require unitMix percentages")
    }

    const oneBedroomUnits = Math.round(totalUnits * (scenario.unitMix.oneBedroom / 100))
    const twoBedroomUnits = Math.round(totalUnits * (scenario.unitMix.twoBedroom / 100))
    const threeBedroomUnits = totalUnits - oneBedroomUnits - twoBedroomUnits

    estimatedPopulation =
      oneBedroomUnits * personsPerUnit.oneBedroom +
      twoBedroomUnits * personsPerUnit.twoBedroom +
      threeBedroomUnits * personsPerUnit.threeBedroom

    const totalUnitArea = totalUnits * (scenario.unitSize || 50)
    const sharedArea = totalUnitArea * ((scenario.sharedSpacePercentage || 20) / 100)
    builtUpArea = totalUnitArea + sharedArea
  } else if (scenario.projectType === "single-family") {
    // Single-family home calculations - REQUIRE numberOfUnits
    if (!scenario.numberOfUnits) {
      throw new Error("Single-family scenarios require numberOfUnits")
    }
    
    totalUnits = scenario.numberOfUnits
    estimatedPopulation = totalUnits * singleFamilyPersons
    builtUpArea = totalUnits * (scenario.houseSize || 100)
  } else if (scenario.projectType === "mixed") {
    // Mixed development calculations - REQUIRE both unit counts
    if (!scenario.apartmentUnits || !scenario.singleFamilyUnits) {
      throw new Error("Mixed scenarios require apartmentUnits and singleFamilyUnits")
    }

    const apartmentUnits = scenario.apartmentUnits
    const singleFamilyUnits = scenario.singleFamilyUnits

    totalUnits = apartmentUnits + singleFamilyUnits

    // Apartments - use average occupancy from country data
    const avgApartmentPopulation = apartmentUnits * ((personsPerUnit.oneBedroom + personsPerUnit.twoBedroom + personsPerUnit.threeBedroom) / 3)
    const avgSingleFamilyPopulation = singleFamilyUnits * singleFamilyPersons

    estimatedPopulation = Math.round(avgApartmentPopulation + avgSingleFamilyPopulation)
    builtUpArea = apartmentUnits * 70 + singleFamilyUnits * 100
  }

  // Calculate land coverage
  const landCoveragePercentage = (builtUpArea / landSize) * 100

  // Determine density classification using configurable thresholds
  const unitsPerHectare = (totalUnits / landSize) * 10000
  let densityClassification: ScenarioResults["densityClassification"]

  const { low, medium, high } = costAssumptions.densityThresholds

  if (unitsPerHectare < low) densityClassification = "low"
  else if (unitsPerHectare < medium) densityClassification = "medium"
  else if (unitsPerHectare < high) densityClassification = "high"
  else densityClassification = "very-high"

  // Calculate costs
  const constructionCostRate = costAssumptions.constructionCosts[scenario.finishLevel]
  const constructionCost = builtUpArea * constructionCostRate

  const infrastructureCost =
    scenario.infrastructureCosts.water + scenario.infrastructureCosts.sewer + scenario.infrastructureCosts.roads

  const totalProjectCost = constructionCost + infrastructureCost
  const costPerUnit = totalProjectCost / totalUnits
  const costPerPerson = totalProjectCost / estimatedPopulation

  // Determine budget status
  let budgetStatus: ScenarioResults["budgetStatus"]
  if (totalProjectCost < projectBudget.min) budgetStatus = "under"
  else if (totalProjectCost > projectBudget.max) budgetStatus = "over"
  else budgetStatus = "within"

  // Calculate infrastructure impact
  const dailyWaterDemand = estimatedPopulation * costAssumptions.waterLitersPerPerson
  const electricityDemand = estimatedPopulation * costAssumptions.electricityKwhPerPerson
  const wasteGeneration = estimatedPopulation * costAssumptions.wasteKgPerPerson

  // Determine infrastructure status using configurable thresholds
  const waterDemandM3 = dailyWaterDemand / 1000
  const { waterDemandExceeds, waterDemandWarning, populationExceeds, populationWarning } = costAssumptions.infrastructureWarningLevels
  
  let infrastructureStatus: ScenarioResults["infrastructureStatus"]

  if (waterDemandM3 > waterDemandExceeds || estimatedPopulation > populationExceeds) {
    infrastructureStatus = "exceeds"
  } else if (waterDemandM3 > waterDemandWarning || estimatedPopulation > populationWarning) {
    infrastructureStatus = "warning"
  } else {
    infrastructureStatus = "ok"
  }

  return {
    totalUnits,
    estimatedPopulation,
    builtUpArea,
    landCoveragePercentage,
    densityClassification,
    totalProjectCost,
    costPerUnit,
    costPerPerson,
    budgetStatus,
    dailyWaterDemand,
    electricityDemand,
    wasteGeneration,
    infrastructureStatus,
  }
}

/**
 * Calculate demand forecast projections
 */
export function calculateDemandForecast(
  currentPopulation: number,
  annualGrowthRate: number,
  timeHorizon: number,
  averageHouseholdSize: number,
  currentHousingUnits: number,
): DemandForecast["projections"] {
  const projections = []

  for (let year = 1; year <= timeHorizon; year++) {
    const population = currentPopulation * Math.pow(1 + annualGrowthRate / 100, year)
    const housingDemand = Math.ceil(population / averageHouseholdSize)
    const surplusShortfall = currentHousingUnits - housingDemand

    projections.push({
      year,
      population: Math.round(population),
      housingDemand,
      surplusShortfall,
    })
  }

  return projections
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format large numbers with abbreviations
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toFixed(0)
}

// ========== HOME BUILDER CALCULATIONS ==========

import type { HomeBuilderConfig, HomeSpecification } from "./types"
import { getCountryData } from "./country-data"

/**
 * Style multipliers for construction costs
 * Basic (1.0x) -> Standard (1.5x) -> Improved (2.5x)
 * Modern (1.8x) -> Traditional (1.3x)
 */
const STYLE_MULTIPLIERS: Record<string, number> = {
  basic: 1.0,
  standard: 1.5,
  luxury: 2.5,
  modern: 1.8,
  traditional: 1.3,
}

/**
 * Size preference multipliers (affects total building area)
 * Small: 60m² | Medium: 100m² | Large: 150m² | Spacious: 200m²
 */
const SIZE_BASE_AREAS: Record<string, number> = {
  small: 60,
  medium: 100,
  large: 150,
  spacious: 200,
}

/**
 * Feature costs (USD)
 */
const FEATURE_COSTS: Record<string, number> = {
  solarPanels: 8000,
  smartHome: 5000,
  airConditioning: 6000,
  swimmingPool: 25000,
  garage: 12000,
  garden: 4000,
}

/**
 * Calculate home building specification based on config
 */
export function calculateHomeSpecification(config: HomeBuilderConfig): HomeSpecification {
  const countryData = getCountryData(config.countryCode)
  const styleMultiplier = STYLE_MULTIPLIERS[config.style] || 1.0
  
  // Determine base construction cost per sqm
  let baseCostPerSqm = countryData.constructionCosts.standard
  if (config.style === "basic") {
    baseCostPerSqm = countryData.constructionCosts.basic
  } else if (config.style === "luxury") {
    baseCostPerSqm = countryData.constructionCosts.improved
  }
  
  // Apply style multiplier
  const adjustedCostPerSqm = baseCostPerSqm * styleMultiplier
  
  // Calculate building area based on size preference
  const baseArea = SIZE_BASE_AREAS[config.sizePreference] || 100
  const totalBuildingArea = baseArea
  
  // Room breakdown (proportional to total area)
  const masterbedroom = totalBuildingArea * 0.15
  const bedroom2 = totalBuildingArea * 0.12
  const bedroom3 = totalBuildingArea * 0.12
  const livingArea = totalBuildingArea * 0.25
  const kitchenArea = totalBuildingArea * 0.12
  const bathrooms = totalBuildingArea * 0.08
  const hallways = totalBuildingArea * 0.16
  
  // Determine bedrooms
  let bedrooms = 2
  if (config.sizePreference === "small") bedrooms = 1
  else if (config.sizePreference === "spacious") bedrooms = 3
  
  // Construction costs
  const buildingCost = Math.round(totalBuildingArea * adjustedCostPerSqm)
  
  // Labor cost (30-40% of construction)
  const laborCostPercentage = countryData.laborCostPercentage / 100
  const laborCost = Math.round(buildingCost * laborCostPercentage)
  
  // Infrastructure costs (water, sewer, electricity)
  const infrastructureCost = 
    countryData.infrastructure.waterPerConnection +
    countryData.infrastructure.sewerPerConnection +
    (countryData.infrastructure.roadsPerMeter * 50) + // ~50m of road per unit
    5000 // electricity connection
  
  // Features costs
  const enabledFeatures = Object.entries(config.features)
    .filter(([_, enabled]) => enabled)
    .map(([featureName, _]) => ({
      feature: featureName,
      cost: FEATURE_COSTS[featureName] || 0,
      description: getFeatureDescription(featureName),
    }))
  
  const featuresCost = enabledFeatures.reduce((sum, f) => sum + f.cost, 0)
  
  // Total construction cost
  const totalCost = buildingCost + laborCost + infrastructureCost + featuresCost
  
  // Annual maintenance (2-3% of construction cost)
  const annualMaintenanceCost = Math.round(buildingCost * 0.025)
  
  // Monthly utilities (based on country and size)
  const dailyWaterUsage = 300 // liters for home
  const monthlyWaterCost = (dailyWaterUsage * 30 * 0.003) // ~$0.003 per liter average
  const monthlyElectricityCost = (totalBuildingArea * 2) // ~2 kWh per sqm per month average
  const monthlyUtilitiesCost = Math.round(monthlyWaterCost + monthlyElectricityCost)
  
  // Property tax (varies by region - estimate 0.5-1% of property value annually)
  const propertyTaxAnnual = Math.round(totalCost * 0.007)
  
  // Insurance (estimate based on value)
  const insuranceAnnual = Math.round(totalCost * 0.004)
  
  // Timeline (months) - roughly 1 month per 20 sqm
  const estimatedTimelineMonths = Math.ceil(totalBuildingArea / 20)
  
  // Budget analysis
  const remainingBudget = config.budget - totalCost
  const percentageUsed = (totalCost / config.budget) * 100
  
  return {
    totalBuildingArea,
    bedrooms,
    bathrooms: 2,
    livingArea,
    kitchenArea,
    buildingCost,
    costPerSqm: adjustedCostPerSqm,
    infrastructureCost,
    featuresCost,
    laborCost,
    totalCost,
    annualMaintenanceCost,
    monthlyUtilitiesCost,
    propertyTaxAnnual,
    insuranceAnnual,
    estimatedTimelineMonths,
    roomBreakdown: [
      { room: "Master Bedroom", area: masterbedroom, description: "Primary master suite" },
      { room: "Bedroom 2", area: bedroom2, description: "Secondary bedroom" },
      { room: "Bedroom 3", area: bedroom3, description: "Tertiary bedroom" },
      { room: "Living Room", area: livingArea, description: "Main living and entertainment space" },
      { room: "Kitchen", area: kitchenArea, description: "Cooking and dining area" },
      { room: "Bathrooms", area: bathrooms, description: "Two full bathrooms" },
      { room: "Hallways", area: hallways, description: "Circulation spaces" },
    ],
    includedFeatures: enabledFeatures,
    remainingBudget,
    percentageUsed,
  }
}

/**
 * Get feature descriptions
 */
function getFeatureDescription(feature: string): string {
  const descriptions: Record<string, string> = {
    solarPanels: "Solar photovoltaic system for renewable energy",
    smartHome: "IoT smart home automation system",
    airConditioning: "Central air conditioning system",
    swimmingPool: "Residential swimming pool with finishing",
    garage: "Attached garage for 2 vehicles",
    garden: "Landscaped garden and outdoor space",
  }
  return descriptions[feature] || feature
}
