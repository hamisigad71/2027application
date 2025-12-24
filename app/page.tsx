"use client";

import { useAuth } from "@/components/auth-provider";
import { AuthForm } from "@/components/auth-form";
import { ProjectsDashboard } from "@/components/projects-dashboard";
import { GlassLoader } from "@/components/glass-loader";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <GlassLoader message="Initializing system..." />;
  }

  if (!user) {
    return <AuthForm />;
  }

  return <ProjectsDashboard />;
}
