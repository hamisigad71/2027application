"use client";

import {
  Building2,
  TrendingUp,
  Users,
  Zap,
  AlertCircle,
  Github,
  Mail,
  ExternalLink,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-border bg-linear-to-b from-background to-muted/30 w-full overflow-x-hidden">
      {/* Decorative grid background */}
      <div className="absolute inset-0 opacity-5 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-primary/20" />
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Building2 className="w-8 h-8 text-primary" />
                <TrendingUp className="w-4 h-4 text-accent absolute bottom-0 right-0" />
              </div>
              <h3 className="text-lg font-bold bg-linear-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                HousingPlan
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering urban planners and developers with intelligent housing
              project analysis tools.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Platform Metrics</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 group cursor-default">
                <Building2 className="w-4 h-4 text-primary mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs">
                  <p className="text-muted-foreground">Projects Planned</p>
                  <p className="font-semibold text-foreground">
                    Unlimited Scenarios
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 group cursor-default">
                <Zap className="w-4 h-4 text-yellow-500 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs">
                  <p className="text-muted-foreground">Real-time Analysis</p>
                  <p className="font-semibold text-foreground">
                    Instant Calculations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 group cursor-default">
                <Users className="w-4 h-4 text-blue-500 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs">
                  <p className="text-muted-foreground">Impact Assessment</p>
                  <p className="font-semibold text-foreground">
                    Population Forecasting
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Capabilities</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full  " />
                Cost Analysis
              </li>
              <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full " />
                Layout Visualization
              </li>
              <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full  " />
                Demand Forecasting
              </li>
              <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full " />
                Infrastructure Impact
              </li>
              <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full  " />
                Scenario Comparison
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Connect</h4>
            <div className="space-y-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="mailto:support@housingplan.dev"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Get in Touch</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

            {/* Status Badge */}
            <div className="pt-2 flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Platform Operational</span>
            </div>
          </div>
        </div>

        {/* Divider with icon */}
        <div className="relative flex items-center gap-4 py-6 mb-6">
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-border to-transparent" />
          <AlertCircle className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="text-center md:text-left space-y-1">
            <p>
              © {currentYear} HousingPlan. Built with intelligence for
              sustainable urban development.
            </p>
            <p className="text-xs">
              Powered by Next.js • Developed by Daysman Gad
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="hover:text-primary transition-colors text-xs font-medium"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors text-xs font-medium"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors text-xs font-medium"
            >
              Documentation
            </a>
          </div>
        </div>

        {/* Ambient gradient effect */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </footer>
  );
}
