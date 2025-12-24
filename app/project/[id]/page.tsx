"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { projectStorage, scenarioStorage } from "@/lib/storage";
import type { Project, Scenario } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, ChevronLeft, Home, Menu, X } from "lucide-react";
import Link from "next/link";
import { GlassLoader } from "@/components/glass-loader";
import { ScenarioSimulator } from "@/components/scenario-simulator";
import { ScenariosList } from "@/components/scenarios-list";
import { ProjectHeader } from "@/components/project-header";
import { ScenarioComparison } from "@/components/scenario-comparison";
import { DemandForecasting } from "@/components/demand-forecasting";
import { ProjectReport } from "@/components/project-report";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("scenarios");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
      return;
    }

    if (user) {
      const loadedProject = projectStorage.getById(resolvedParams.id);

      if (!loadedProject || loadedProject.userId !== user.id) {
        router.push("/");
        return;
      }

      setProject(loadedProject);
      loadScenarios();
    }

    // Check navigation history
    setCanGoBack(window.history.length > 1);

    const handlePopState = () => {
      setCanGoBack(window.history.length > 1);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [resolvedParams.id, user, isLoading, router]);

  const loadScenarios = () => {
    const projectScenarios = scenarioStorage.getByProjectId(resolvedParams.id);
    setScenarios(projectScenarios);
  };

  const handleCreateScenario = () => {
    if (!project) return;

    const newScenario = scenarioStorage.create({
      projectId: project.id,
      name: `Scenario ${scenarios.length + 1}`,
      unitSize: 50,
      unitsPerFloor: 8,
      numberOfFloors: 4,
      unitMix: {
        oneBedroom: 50,
        twoBedroom: 40,
        threeBedroom: 10,
      },
      sharedSpacePercentage: 20,
      constructionCostPerSqm: 600,
      infrastructureCosts: {
        water: 50000,
        sewer: 75000,
        roads: 100000,
      },
      finishLevel: "standard" as const,
    });

    loadScenarios();
    setActiveScenarioId(newScenario.id);
    setActiveTab("simulator");
  };

  const handleScenarioDeleted = () => {
    loadScenarios();
    setActiveScenarioId(null);
  };

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleHome = useCallback(() => {
    router.push("/");
  }, [router]);

  if (isLoading || !project) {
    return <GlassLoader message="Loading project details..." />;
  }

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Back and Title */}
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={handleBack}
                disabled={!canGoBack}
                className={`p-2 rounded-lg transition-colors ${
                  canGoBack
                    ? "hover:bg-slate-100 cursor-pointer"
                    : "opacity-40 cursor-not-allowed"
                }`}
                title="Go back"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>

              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900 truncate">
                  {project?.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 truncate">
                  Project Details
                </p>
              </div>
            </div>

            {/* Right side - Action buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleHome}
                className="text-slate-600"
              >
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setActiveTab("scenarios")}
              >
                <Plus className="h-4 w-4 mr-1" />
                New Scenario
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-slate-600" />
              ) : (
                <Menu className="h-6 w-6 text-slate-600" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t border-slate-200 py-4 space-y-2 animate-in slide-in-from-top-2">
              <Button
                variant="outline"
                className="w-full justify-start text-slate-600"
                onClick={() => {
                  handleHome();
                  setMobileMenuOpen(false);
                }}
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
              <Button
                variant="default"
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("scenarios");
                  setMobileMenuOpen(false);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Scenario
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ProjectHeader - Shows project details */}
        <div className="mb-8">
          <ProjectHeader project={project} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="bg-white border border-slate-200">
                <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
                <TabsTrigger value="simulator" disabled={!activeScenario}>
                  Simulator
                </TabsTrigger>
                <TabsTrigger value="comparison" disabled={scenarios.length < 2}>
                  Comparison
                </TabsTrigger>
                <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
              </TabsList>

              <TabsContent value="scenarios" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Project Scenarios
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Create and manage different design scenarios for this
                      project
                    </p>
                  </div>
                  <Button
                    onClick={handleCreateScenario}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Scenario
                  </Button>
                </div>

                <ScenariosList
                  scenarios={scenarios}
                  project={project}
                  activeScenarioId={activeScenarioId}
                  onScenarioSelect={(id) => {
                    setActiveScenarioId(id);
                    setActiveTab("simulator");
                  }}
                  onScenarioDeleted={handleScenarioDeleted}
                />
              </TabsContent>

              <TabsContent value="simulator">
                {activeScenario && (
                  <ScenarioSimulator
                    scenario={activeScenario}
                    project={project}
                    onUpdate={loadScenarios}
                  />
                )}
              </TabsContent>

              <TabsContent value="comparison">
                {scenarios.length >= 2 && (
                  <ScenarioComparison scenarios={scenarios} project={project} />
                )}
              </TabsContent>

              <TabsContent value="forecasting">
                <DemandForecasting project={project} scenarios={scenarios} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <ProjectReport project={project} scenarios={scenarios} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
