# 🏗️ Affordable Housing Planning & Decision Support System

> **A comprehensive platform for urban planners, developers, and policymakers to design, analyze, and optimize affordable housing solutions.**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/muriukijoseph028-6997s-projects/v0-housing-planning-tool)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

## 🎯 Executive Summary

The **Affordable Housing Planning Tool** is an enterprise-grade decision support system designed to empower organizations in developing sustainable, scalable housing solutions. By combining advanced financial modeling, infrastructure impact analysis, and scenario simulation, this platform enables data-driven planning for one of the world's most critical challenges: affordable housing accessibility.

### Who Is This For?

- **Urban Planners & Development Agencies** - Create and manage large-scale housing projects
- **Real Estate Developers** - Analyze project viability and optimize layouts  
- **Policymakers & NGOs** - Evaluate housing strategies across regions
- **Individual Homeowners** - Configure and cost-estimate custom homes
- **Government Housing Programs** - Forecast demand and allocate resources strategically

---

## ✨ Core Features

### 1. **Multi-Project Dashboard**
A centralized hub for managing all housing initiatives with real-time analytics:
- **Project Portfolio View** - Track total units, population served, investment allocation, and scenario analysis
- **Real-Time Statistics** - Aggregate metrics across all projects (total units, people housed, total investment)
- **Recent Activity Timeline** - Monitor project updates and changes in chronological order
- **Quick Tips & Guidance** - Contextual planning best practices and efficiency recommendations

### 2. **Advanced Project Configuration**
Create sophisticated housing projects tailored to specific contexts:
- **Project Types**: Apartments, Single-Family Homes, or Mixed-Use Developments
- **Geographic Customization**: Country-specific data for construction costs, infrastructure rates, and demographic assumptions
- **Budget Ranges**: Define financial constraints and track against actual costs
- **Target Demographics**: Tailor to low-income, lower-middle, middle, or mixed income groups
- **Land Parameters**: Specify total land size and measure in preferred units (m² or acres)

### 3. **Scenario Simulator** 
Test multiple housing configurations without committing resources:

#### Apartment Building Scenarios
- Define building dimensions (units per floor, number of floors)
- Configure unit mix (% of 1-bed, 2-bed, 3-bed units)
- Set unit sizes and shared space allocations
- Simulate multiple vertical development patterns

#### Single-Family Home Scenarios  
- Plan neighborhood layouts with configurable lot sizes
- Define house footprints and total counts
- Test different density patterns
- Estimate community infrastructure needs

#### Mixed-Use Development Scenarios
- Combine apartments and single-family housing
- Create diverse, vibrant communities
- Balance high-density urban with lower-density residential
- Optimize land utilization

### 4. **Intelligent Cost Modeling**
Comprehensive financial analysis built on real-world data:
- **Construction Costs**: Material and labor pricing by finish level (basic, standard, improved)
- **Infrastructure Breakdown**:
  - Water supply systems
  - Sewer infrastructure  
  - Road networks
  - Electricity grid
- **Cost Per Unit & Per Person** - Compare efficiency across scenarios
- **Budget Tracking** - Real-time status (under budget / within range / over budget)
- **Finish Level Options** - Scale costs from basic shelter to improved housing

### 5. **Infrastructure Impact Assessment**
Evaluate environmental and operational implications:
- **Daily Water Demand** - Calculate liters needed per household
- **Electricity Consumption** - Estimate kWh requirements  
- **Waste Generation** - Project solid waste per capita
- **Infrastructure Capacity Warnings** - Identify projects exceeding local thresholds
- **Density Classification** - Categorize projects by urban density (low/medium/high/very-high)

### 6. **Scenario Comparison Engine**
Side-by-side analysis of multiple housing configurations:
- Compare cost efficiency across scenarios
- Evaluate population impact variations
- Assess density and land coverage trade-offs
- Identify optimal balance between affordability and density

### 7. **Demand Forecasting Tool**
Project future housing needs with demographic projections:
- **Growth Rate Modeling** - Input annual population growth percentages
- **5/10/20-Year Projections** - Plan for short, medium, and long-term demand
- **Surplus/Shortfall Analysis** - Identify under/over capacity
- **Evidence-Based Planning** - Justify project scale with demographic data

### 8. **Visual Layout Planning**
Interactive visualization of housing configurations:
- **Unit Distribution Maps** - See spatial arrangement of homes
- **Density Heatmaps** - Visualize population concentration
- **Land Coverage Analysis** - Understand building footprint impact
- **3D-Ready Export** - Prepare for advanced rendering

### 9. **Comprehensive Project Reporting**
Generate professional documentation for stakeholders:
- **Executive Summaries** - High-level project overview
- **Financial Statements** - Detailed cost breakdowns
- **Infrastructure Analysis** - Impact assessments
- **Scenario Comparison Tables** - Alternative options side-by-side
- **PDF Export** - Professional reports for presentations
- **HTML Reports** - Digital sharing and web publishing

### 10. **Home Builder Tool** (Individual Configuration)
Personal-scale planning for homeowners:
- **Land Size & Budget Input** - Define personal constraints
- **Style Selection** - Choose architectural preferences (modern, traditional, luxury, basic)
- **Feature Configuration**:
  - Solar Panels & Renewable Energy
  - Smart Home Technology
  - Air Conditioning Systems
  - Swimming Pools
  - Garage & Parking
  - Garden & Landscaping
- **Real-Time Cost Estimation** - See budget impact of choices
- **Room-by-Room Breakdown** - Specify areas for each space
- **Comprehensive Costing**:
  - Building costs
  - Infrastructure/connections
  - Labor and materials
  - Feature premiums
  - Annual maintenance and utilities
  - Property tax and insurance estimates
- **Timeline Estimates** - Construction duration projections

---

## 🔧 Technical Architecture

### Frontend Stack
- **Next.js 16** - React framework with server-side rendering
- **React 19** - Modern UI component library
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS 4.1** - Utility-first responsive styling
- **Shadcn/UI** - High-quality accessible component library

### Core Libraries
- **Recharts** - Data visualization and charts
- **React Hook Form** - Efficient form management
- **Radix UI** - Primitives for accessible dialogs, dropdowns, and menus
- **Lucide React** - Beautiful icon system
- **Zod** - Runtime schema validation

### Data Layer
- **Browser Local Storage** - Project persistence without backend
- **Custom Storage API** - Wrapper for user, project, and scenario data
- **Type-Safe Models** - Full TypeScript interfaces for all entities

### Backend Features (No External Server Required)
- **Authentication System** - User login/logout with in-app persistence
- **Project Management** - Create, read, update, delete operations
- **Scenario Storage** - Save multiple configurations per project
- **User Profiles** - Customize user information and preferences

---

## 📊 Key Calculation Engines

### Scenario Results Calculation
Automatically computes:
- **Total Units** - Sum of all housing units
- **Estimated Population** - Based on occupancy assumptions per unit type
- **Built-Up Area** - Total constructed space (building + shared areas)
- **Land Coverage %** - Percentage of land utilized
- **Density Classification** - Low/medium/high/very-high density categorization
- **Total Project Cost** - Construction + Infrastructure
- **Cost Per Unit** - Financial efficiency metric
- **Cost Per Person** - Social impact metric
- **Infrastructure Status** - Flags excessive water/electricity demand

### Country-Specific Data
Customizable assumptions for different regions:
- Construction costs (basic, standard, improved levels)
- Infrastructure unit costs (per connection/meter)
- Population occupancy rates by unit type
- Density thresholds (configurable per country)
- Resource consumption baselines
- Room size standards

---

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/housing-planning-tool.git
cd housing-planning-tool

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Visit `http://localhost:3000` to access the application.

### Build for Production

```bash
pnpm build
pnpm start
```

### Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fhousing-planning-tool)

---

## 📁 Project Structure

```
housing-planning-tool/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Authentication & dashboard routing
│   ├── layout.tsx                # Root layout
│   ├── home-configurator/        # Individual home builder
│   └── project/[id]/             # Dynamic project pages
├── components/                   # React components
│   ├── auth-form.tsx             # Login/signup interface
│   ├── projects-dashboard.tsx    # Main dashboard
│   ├── scenario-simulator.tsx    # Scenario creation & testing
│   ├── scenario-comparison.tsx   # Multi-scenario analysis
│   ├── demand-forecasting.tsx    # Population projections
│   ├── layout-visualization.tsx  # Visual planning tools
│   ├── project-report.tsx        # Report generation
│   ├── home-configurator.tsx     # Personal home builder
│   ├── cost-breakdown-chart.tsx  # Financial visualization
│   └── ui/                       # Reusable UI components
├── lib/
│   ├── types.ts                  # TypeScript interfaces
│   ├── calculations.ts           # Core calculation engine
│   ├── country-data.ts           # Regional cost assumptions
│   ├── storage.ts                # Local data persistence
│   ├── utils.ts                  # Helper functions
│   └── utils.ts                  # Formatting & validation
├── public/                       # Static assets
├── styles/                       # Global CSS
└── package.json                  # Dependencies
```

---

## 🎓 How It Works: User Journey

### 1. **Authentication**
Users create accounts or log in with email credentials (demo-only authentication).

### 2. **Dashboard Navigation**
Upon login, users see:
- Portfolio statistics (total projects, units, investment)
- Recent project activity timeline
- Quick-start guides and tips
- Button to create new project

### 3. **Project Creation**
Define base parameters:
- Project name & location (country/city)
- Land size (m² or acres)
- Target income group
- Budget range
- Project type (apartments/single-family/mixed)

### 4. **Scenario Planning**
For each project, create multiple scenarios:
- Configure building layout (apartments) or lot sizes (single-family)
- Set cost parameters (construction rates, infrastructure)
- Finish level selection
- System auto-calculates results

### 5. **Analysis & Comparison**
- View individual scenario metrics
- Compare multiple scenarios side-by-side
- Run demand forecasts
- Visualize layouts
- Export professional reports

### 6. **Reporting**
- Generate PDF reports with full analysis
- Share HTML versions
- Track changes over time

---

## 💡 Use Cases

### Case 1: Large-Scale Public Housing
**Scenario**: Government needs to plan 5,000 units in a specific region
- Input: Land area (500 hectares), budget ($100M), target population
- Create: Apartment scenarios with different densities
- Analyze: Infrastructure capacity, cost per unit, affordability ratio
- Output: Detailed financial and infrastructure reports

### Case 2: Mixed-Use Development
**Scenario**: Developer wants vibrant urban neighborhood
- Design: Combination of apartments and townhouses
- Test: Multiple layout options
- Compare: Cost/benefit trade-offs
- Forecast: 10-year demand growth
- Export: Professional presentation deck

### Case 3: Individual Home Planning
**Scenario**: Family wants to build custom home in rural area
- Configure: Budget, land size, architectural style
- Select: Premium features (solar, smart home, pool)
- Calculate: Comprehensive cost breakdown
- Timeline: Construction duration estimate
- Export: Detailed specification sheet

---

## 🔐 Data & Privacy

- **Client-Side Storage**: All projects stored locally in browser (no external servers)
- **No Cloud Dependencies**: Works completely offline after initial load
- **User Data**: Email and basic profile stored locally
- **Export Control**: Users own all generated reports and data

---

## 📈 Performance & Scalability

- **React 19 Optimization**: Fast re-renders with concurrent features
- **TypeScript Safety**: Eliminate runtime errors
- **Responsive Design**: Works seamlessly on desktop, tablet, mobile
- **Large Dataset Handling**: Efficient calculations for 1000+ unit projects
- **Real-Time Updates**: Instant metric recalculation on parameter changes

---

## 🎨 Design Philosophy

The platform uses a **modern glass-morphism design** with:
- Gradient backgrounds and smooth transitions
- Accessible color contrast (WCAG compliant)
- Intuitive navigation and clear information hierarchy
- Responsive layouts for all device sizes
- Dark mode support via Tailwind CSS

---

## 🤝 Contributing

We welcome contributions! Areas for enhancement:
- Additional country-specific cost data
- Advanced 3D visualization
- Sustainability metrics (carbon footprint, energy efficiency)
- Climate resilience analysis
- Integration with GIS systems
- Mobile app version

---

## 📝 License

This project is available under the MIT License.

---

## 🚀 Live Demo

**[Access the Live Application](https://vercel.com/muriukijoseph028-6997s-projects/v0-housing-planning-tool)**

---

## 💬 Questions & Support

For questions about the platform capabilities or integration, contact the development team.

**Built with ❤️ to make affordable housing planning accessible to everyone.**
