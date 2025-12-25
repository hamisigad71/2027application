"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "./auth-provider";
import { useToast } from "./toast-provider";
import { projectStorage, scenarioStorage } from "@/lib/storage";
import type { Project, Scenario } from "@/lib/types";
import {
  Plus,
  FolderOpen,
  MapPin,
  Calendar,
  LogOut,
  User,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  Menu,
  X,
} from "lucide-react";
import { CreateProjectDialog } from "./create-project-dialog";
import { ProjectCard } from "./project-card";
import { UserProfile } from "./user-profile";

export function ProjectsDashboard() {
  const { user, logout } = useAuth();
  const { showSuccess } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = () => {
    if (!user) return;
    const allProjects = projectStorage.getAll();
    const userProjects = allProjects.filter(
      (p: Project) => p.userId === user.id
    );
    setProjects(userProjects);
  };

  const stats = useMemo(() => {
    let totalUnits = 0;
    let totalPeopleHoused = 0;
    let totalBudget = 0;
    let scenarioCount = 0;

    projects.forEach((project) => {
      const scenarios = scenarioStorage.getByProjectId(project.id);
      scenarios.forEach((scenario: Scenario) => {
        if (scenario.calculatedResults) {
          scenarioCount++;
          totalUnits += scenario.calculatedResults.totalUnits || 0;
          totalPeopleHoused +=
            scenario.calculatedResults.estimatedPopulation || 0;
          totalBudget += scenario.calculatedResults.totalProjectCost || 0;
        }
      });
    });

    return {
      totalUnits,
      totalPeopleHoused,
      totalBudget,
      scenarioCount,
      avgUnitsPerProject:
        projects.length > 0 ? Math.round(totalUnits / projects.length) : 0,
    };
  }, [projects]);

  const recentProjects = useMemo(() => {
    return [...projects]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 3);
  }, [projects]);

  const handleProjectCreated = () => {
    loadProjects();
    setShowCreateDialog(false);
  };

  const handleProjectDeleted = (projectId: string) => {
    projectStorage.delete(projectId);
    // Immediately update state by filtering out the deleted project
    setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
    showSuccess("Project deleted successfully");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-x-hidden w-full">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo and Title - Always visible */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-blue-900 to-blue-700 flex items-center justify-center shadow-lg shrink-0">
                <Building className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-bold bg-linear-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                  Affordable Housing
                </h1>
                <p className="text-xs text-slate-600 truncate">
                  Decision Support System
                </p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                onClick={() => setShowProfile(true)}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 whitespace-nowrap"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                onClick={logout}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 whitespace-nowrap"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
              title={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-slate-600" />
              ) : (
                <Menu className="h-6 w-6 text-slate-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-3 pb-3 border-t border-slate-200 pt-3 space-y-2 animate-in slide-in-from-top-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowProfile(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-md bg-linear-to-br from-blue-900 to-blue-800 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-blue-100">
                Total Projects
              </CardTitle>
              <FolderOpen className="h-5 w-5 text-blue-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold">{projects.length}</div>
              <p className="text-xs text-blue-200 mt-2">
                Active housing projects
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Housing Units
              </CardTitle>
              <Building className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">
                {stats.totalUnits.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (stats.totalUnits / 10000) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-slate-500">
                  {stats.avgUnitsPerProject}/project
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                People Housed
              </CardTitle>
              <Users className="h-5 w-5 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">
                {stats.totalPeopleHoused.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-violet-600">
                <TrendingUp className="h-3 w-3" />
                <span>Social impact potential</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Investment
              </CardTitle>
              <DollarSign className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">
                {stats.totalBudget > 0
                  ? `$${(stats.totalBudget / 1000000).toFixed(1)}M`
                  : "$0"}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {stats.scenarioCount} scenarios analyzed
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Your Projects
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {projects.length === 0
                    ? "Create your first housing project to get started"
                    : `Managing ${projects.length} housing ${
                        projects.length === 1 ? "project" : "projects"
                      }`}
                </p>
              </div>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-blue-900 hover:bg-blue-800 shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
              <Card className="border-2 border-dashed border-slate-200 shadow-none">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                    <FolderOpen className="h-10 w-10 text-blue-900" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No projects yet
                  </h3>
                  <p className="text-sm text-slate-600 text-center mb-6 max-w-md leading-relaxed">
                    Start planning affordable housing by creating your first
                    project. You'll be able to simulate layouts, calculate
                    costs, and compare scenarios.
                  </p>
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-blue-900 hover:bg-blue-800 shadow-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onDelete={handleProjectDeleted}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-900" />
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {recentProjects.length > 0 ? (
                  <div className="space-y-3">
                    {recentProjects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-900 mt-2" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {project.name}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {project.location.city}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {new Date(project.updatedAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-8">
                    No recent activity
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="border-0 shadow-md bg-linear-to-br from-blue-50 to-slate-50">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-900 mt-1.5 shrink-0" />
                  <p className="leading-relaxed">
                    Create multiple scenarios to compare different layout
                    approaches
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-900 mt-1.5 shrink-0" />
                  <p className="leading-relaxed">
                    Use demand forecasting to plan for future housing needs
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-900 mt-1.5 shrink-0" />
                  <p className="leading-relaxed">
                    Monitor infrastructure impact to ensure sustainable
                    development
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onProjectCreated={handleProjectCreated}
      />

      {/* UserProfile Modal */}
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </div>
  );
}
