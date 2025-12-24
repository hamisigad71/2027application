"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "./auth-provider";
import { useToast } from "./toast-provider";
import { Building2, Mail, User, Phone, MapPin } from "lucide-react";

export function AuthForm() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInName, setSignInName] = useState("");

  // Sign Up Form State
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[v0] Sign in form submitted");

    if (!signInEmail || !signInName) {
      showError("Please fill in all required fields");
      return;
    }

    console.log("[v0] Calling login with:", { signInEmail, signInName });
    login(signInEmail, signInName);
    showSuccess("Signed in successfully!");
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[v0] Sign up form submitted");

    if (!email || !name) {
      showError("Please fill in all required fields");
      return;
    }

    console.log("[v0] Calling login with full profile");
    login(email, name, organization, role, phone, country);
    showSuccess("Account created successfully!");
  };

  const handleGoogleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("[v0] Google sign-in button clicked");

    const demoEmail = "demo@example.com";
    const demoName = "Demo User";
    const demoOrg = "Demo Organization";
    const demoRole = "Government Planner";
    const demoPhone = "+1234567890";
    const demoCountry = "United States";

    console.log("[v0] Logging in demo user");
    login(demoEmail, demoName, demoOrg, demoRole, demoPhone, demoCountry);
    showSuccess("Signed in with Google!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:block space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-900 text-white">
              <Building2 className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 leading-tight">
              Smart Affordable Housing Planning Tool
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Plan, simulate, and optimize affordable housing projects with
              data-driven insights for governments, NGOs, and developers.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4 text-blue-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  Real-Time Simulations
                </h3>
                <p className="text-sm text-slate-600">
                  Instantly calculate costs, capacity, and infrastructure impact
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4 text-blue-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  Scenario Comparison
                </h3>
                <p className="text-sm text-slate-600">
                  Compare multiple layouts and choose the best approach
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0\">
                <svg
                  className="w-4 h-4 text-blue-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  Professional Reports
                </h3>
                <p className="text-sm text-slate-600">
                  Export stakeholder-ready reports and analysis
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="md:hidden mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-900 text-white mb-3">
                <Building2 className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "signin" | "signup")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="signin-name"
                        type="text"
                        placeholder="John Doe"
                        value={signInName}
                        onChange={(e) => setSignInName(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-900 hover:bg-blue-800"
                  >
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign up with Google
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">
                      Or create account
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="organization"
                        type="text"
                        placeholder="Government Agency, NGO, Developer..."
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Government Planner">
                            Government Planner
                          </SelectItem>
                          <SelectItem value="NGO Manager">
                            NGO Manager
                          </SelectItem>
                          <SelectItem value="Real Estate Developer">
                            Real Estate Developer
                          </SelectItem>
                          <SelectItem value="Architect">Architect</SelectItem>
                          <SelectItem value="Consultant">Consultant</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1234567890"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="country"
                        type="text"
                        placeholder="United States"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-900 hover:bg-blue-800"
                  >
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
