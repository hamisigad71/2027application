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
