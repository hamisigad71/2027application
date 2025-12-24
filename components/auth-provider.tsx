"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/lib/types"
import { authStorage } from "@/lib/storage"

interface AuthContextType {
  user: User | null
  login: (email: string, name: string, organization?: string, role?: string, phone?: string, country?: string) => void
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] AuthProvider mounting, checking for existing user")
    // Load user from storage on mount
    const currentUser = authStorage.getCurrentUser()
    console.log("[v0] Current user from storage:", currentUser)
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = (
    email: string,
    name: string,
    organization?: string,
    role?: string,
    phone?: string,
    country?: string,
  ) => {
    console.log("[v0] Login called with:", { email, name, organization, role, phone, country })
    const newUser = authStorage.login(email, name, organization, role, phone, country)
    console.log("[v0] New user created:", newUser)
    setUser(newUser)
  }

  const logout = () => {
    console.log("[v0] Logout called")
    authStorage.clearCurrentUser()
    setUser(null)
  }

  const updateProfile = (updates: Partial<User>) => {
    console.log("[v0] Update profile called with:", updates)
    const updatedUser = authStorage.updateProfile(updates)
    if (updatedUser) {
      console.log("[v0] Profile updated:", updatedUser)
      setUser(updatedUser)
    }
  }

  console.log("[v0] AuthProvider render - user:", user, "isLoading:", isLoading)

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
