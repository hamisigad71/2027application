// Local storage abstraction layer - easily replaceable with API calls

const STORAGE_KEYS = {
  CURRENT_USER: "housing_planner_current_user",
  PROJECTS: "housing_planner_projects",
  SCENARIOS: "housing_planner_scenarios",
  COST_ASSUMPTIONS: "housing_planner_cost_assumptions",
} as const

// Helper to safely parse JSON from localStorage
function safeGetItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

// Helper to safely set JSON to localStorage
function safeSetItem(key: string, value: unknown): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error("[v0] Storage error:", error)
  }
}

// User authentication (simplified for MVP)
export const authStorage = {
  getCurrentUser: () => safeGetItem(STORAGE_KEYS.CURRENT_USER, null),

  setCurrentUser: (user: any) => {
    safeSetItem(STORAGE_KEYS.CURRENT_USER, user)
  },

  clearCurrentUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    }
  },

  login: (email: string, name: string, organization?: string, role?: string, phone?: string, country?: string) => {
    const user = {
      id: Date.now().toString(),
      email,
      name,
      organization,
      role,
      phone,
      country,
      createdAt: new Date().toISOString(),
    }
    authStorage.setCurrentUser(user)
    return user
  },

  updateProfile: (updates: Partial<any>) => {
    const currentUser = authStorage.getCurrentUser()
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates }
      authStorage.setCurrentUser(updatedUser)
      return updatedUser
    }
    return null
  },
}

// Project storage
export const projectStorage = {
  getAll: () => safeGetItem(STORAGE_KEYS.PROJECTS, []),

  getById: (id: string) => {
    const projects = projectStorage.getAll()
    return projects.find((p: any) => p.id === id)
  },

  create: (project: any) => {
    const projects = projectStorage.getAll()
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    projects.push(newProject)
    safeSetItem(STORAGE_KEYS.PROJECTS, projects)
    return newProject
  },

  update: (id: string, updates: any) => {
    const projects = projectStorage.getAll()
    const index = projects.findIndex((p: any) => p.id === id)

    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      safeSetItem(STORAGE_KEYS.PROJECTS, projects)
      return projects[index]
    }
    return null
  },

  delete: (id: string) => {
    const projects = projectStorage.getAll()
    const filtered = projects.filter((p: any) => p.id !== id)
    safeSetItem(STORAGE_KEYS.PROJECTS, filtered)

    // Also delete associated scenarios
    const scenarios = scenarioStorage.getAll()
    const filteredScenarios = scenarios.filter((s: any) => s.projectId !== id)
    safeSetItem(STORAGE_KEYS.SCENARIOS, filteredScenarios)
  },
}

// Scenario storage
export const scenarioStorage = {
  getAll: () => safeGetItem(STORAGE_KEYS.SCENARIOS, []),

  getByProjectId: (projectId: string) => {
    const scenarios = scenarioStorage.getAll()
    return scenarios.filter((s: any) => s.projectId === projectId)
  },

  getById: (id: string) => {
    const scenarios = scenarioStorage.getAll()
    return scenarios.find((s: any) => s.id === id)
  },

  create: (scenario: any) => {
    const scenarios = scenarioStorage.getAll()
    const newScenario = {
      ...scenario,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    scenarios.push(newScenario)
    safeSetItem(STORAGE_KEYS.SCENARIOS, scenarios)
    return newScenario
  },

  update: (id: string, updates: any) => {
    const scenarios = scenarioStorage.getAll()
    const index = scenarios.findIndex((s: any) => s.id === id)

    if (index !== -1) {
      scenarios[index] = {
        ...scenarios[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      safeSetItem(STORAGE_KEYS.SCENARIOS, scenarios)
      return scenarios[index]
    }
    return null
  },

  delete: (id: string) => {
    const scenarios = scenarioStorage.getAll()
    const filtered = scenarios.filter((s: any) => s.id !== id)
    safeSetItem(STORAGE_KEYS.SCENARIOS, filtered)
  },
}

// Cost assumptions storage
export const costAssumptionsStorage = {
  get: (country: string) => {
    const assumptions = safeGetItem(STORAGE_KEYS.COST_ASSUMPTIONS, {})
    return assumptions[country] || getDefaultAssumptions(country)
  },

  set: (country: string, assumptions: any) => {
    const allAssumptions = safeGetItem(STORAGE_KEYS.COST_ASSUMPTIONS, {})
    allAssumptions[country] = assumptions
    safeSetItem(STORAGE_KEYS.COST_ASSUMPTIONS, allAssumptions)
  },
}

// Import country data
import { getCountryData } from "./country-data"

// Default cost assumptions - NOW COUNTRY-SPECIFIC
function getDefaultAssumptions(countryCode: string): any {
  const countryData = getCountryData(countryCode)
  
  return {
    country: countryCode,
    constructionCosts: countryData.constructionCosts,
    waterPerConnection: countryData.infrastructure.waterPerConnection,
    sewerPerConnection: countryData.infrastructure.sewerPerConnection,
    roadsPerMeter: countryData.infrastructure.roadsPerMeter,
    personsPerUnit: countryData.occupancy,
    singleFamilyPersonsPerUnit: 4, // Default average household size
    waterLitersPerPerson: countryData.utilities.waterLitersPerPerson,
    electricityKwhPerPerson: countryData.utilities.electricityKwhPerPerson,
    wasteKgPerPerson: countryData.utilities.wasteKgPerPerson,
    laborCostPercentage: countryData.laborCostPercentage,
    // Density thresholds (units per hectare)
    densityThresholds: {
      low: 50,
      medium: 150,
      high: 300,
      veryHigh: 500,
    },
    // Infrastructure warning levels
    infrastructureWarningLevels: {
      waterDemandExceeds: 500,    // m³ per day
      waterDemandWarning: 300,    // m³ per day
      populationExceeds: 2000,     // population
      populationWarning: 1500,     // population
    },
    // Standard room sizes (m²)
    roomSizes: {
      masterBedroom: 20,
      bedroom: 15,
      livingRoom: 30,
      kitchen: 15,
      bathroom: 10,
      hallway: 8,
    },
  }
}
