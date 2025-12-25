"use client"

import { usePathname } from "next/navigation"
import { FloatingPageNav } from "@/components/floating-page-nav"
import { useCallback, useEffect, useState } from "react"
import { projectStorage } from "@/lib/storage"
import type { Project } from "@/lib/types"
import { useAuth } from "@/components/auth-provider"

export function GlobalFloatingNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)

  // Determine if we should show the nav
  const isAuthPage = pathname === "/" && !user
  const isProjectPage = pathname.startsWith("/project/")
  const isDashboardPage = pathname === "/" && user

  // Extract project ID from URL if on project page
  const projectIdMatch = pathname.match(/\/project\/([^/]+)/)
  const currentProjectId = projectIdMatch?.[1]

  useEffect(() => {
    if (user && (isProjectPage || isDashboardPage)) {
      const allUserProjects = projectStorage.getAll().filter((p: any) => p.userId === user.id)
      setAllProjects(allUserProjects)

      if (isProjectPage && currentProjectId) {
        const index = allUserProjects.findIndex((p) => p.id === currentProjectId)
        setCurrentProjectIndex(Math.max(0, index))
      }
    }
  }, [user, isProjectPage, isDashboardPage, currentProjectId])

  const handlePreviousProject = useCallback(() => {
    if (currentProjectIndex > 0) {
      const prevProject = allProjects[currentProjectIndex - 1]
      window.location.href = `/project/${prevProject.id}`
    }
  }, [currentProjectIndex, allProjects])

  const handleNextProject = useCallback(() => {
    if (currentProjectIndex < allProjects.length - 1) {
      const nextProject = allProjects[currentProjectIndex + 1]
      window.location.href = `/project/${nextProject.id}`
    }
  }, [currentProjectIndex, allProjects])

  // Don't show on auth pages or when not authenticated
  if (isAuthPage || !user) {
    return null
  }

  return (
    <FloatingPageNav
      onPrevious={handlePreviousProject}
      onNext={handleNextProject}
      canGoPrev={currentProjectIndex > 0}
      canGoNext={currentProjectIndex < allProjects.length - 1}
      currentPage={currentProjectIndex + 1}
      totalPages={allProjects.length}
    />
  )
}
