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
  // Calculate total units
  const totalUnits = scenario.unitsPerFloor * scenario.numberOfFloors

  // Calculate estimated population based on unit mix
  const oneBedroomUnits = Math.round(totalUnits * (scenario.unitMix.oneBedroom / 100))
  const twoBedroomUnits = Math.round(totalUnits * (scenario.unitMix.twoBedroom / 100))
  const threeBedroomUnits = totalUnits - oneBedroomUnits - twoBedroomUnits

  const estimatedPopulation =
    oneBedroomUnits * costAssumptions.personsPerUnit.oneBedroom +
    twoBedroomUnits * costAssumptions.personsPerUnit.twoBedroom +
    threeBedroomUnits * costAssumptions.personsPerUnit.threeBedroom

  // Calculate built-up area
  const totalUnitArea = totalUnits * scenario.unitSize
  const sharedArea = totalUnitArea * (scenario.sharedSpacePercentage / 100)
  const builtUpArea = totalUnitArea + sharedArea

  // Calculate land coverage
  const landCoveragePercentage = (builtUpArea / scenario.numberOfFloors / landSize) * 100

  // Determine density classification
  const unitsPerHectare = (totalUnits / landSize) * 10000
  let densityClassification: ScenarioResults["densityClassification"]

  if (unitsPerHectare < 50) densityClassification = "low"
  else if (unitsPerHectare < 150) densityClassification = "medium"
  else if (unitsPerHectare < 300) densityClassification = "high"
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

  // Determine infrastructure status (simple rule-based)
  const waterDemandM3 = dailyWaterDemand / 1000
  let infrastructureStatus: ScenarioResults["infrastructureStatus"]

  if (waterDemandM3 > 500 || estimatedPopulation > 2000) {
    infrastructureStatus = "exceeds"
  } else if (waterDemandM3 > 300 || estimatedPopulation > 1500) {
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
