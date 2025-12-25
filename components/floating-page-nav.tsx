"use client"

import { ChevronLeft, ChevronRight, Home, Zap } from "lucide-react"
import { useState, useEffect } from "react"

interface FloatingPageNavProps {
  onPrevious?: () => void
  onNext?: () => void
  canGoPrev?: boolean
  canGoNext?: boolean
  currentPage?: number
  totalPages?: number
}

export function FloatingPageNav({
  onPrevious,
  onNext,
  canGoPrev = true,
  canGoNext = true,
  currentPage,
  totalPages,
}: FloatingPageNavProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [hoveredButton, setHoveredButton] = useState<"prev" | "next" | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show nav when scrolling UP (negative delta) from a position
      if (currentScrollY < lastScrollY && currentScrollY > 100) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY + 50 || currentScrollY < 50) {
        // Hide when scrolling DOWN significantly or at top
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && canGoPrev) {
        onPrevious?.()
      } else if (e.key === "ArrowRight" && canGoNext) {
        onNext?.()
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("keydown", handleKeyDown)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [lastScrollY, canGoPrev, canGoNext, onPrevious, onNext])

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 ease-out z-50 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none"
      }`}
    >
      <div className="relative">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Main container */}
        <div className="relative flex items-center gap-1 bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-xl rounded-full shadow-2xl border border-white/50 px-2 py-2 ring-1 ring-white/20">
          {/* Previous Button */}
          <button
            onClick={onPrevious}
            disabled={!canGoPrev}
            onMouseEnter={() => setHoveredButton("prev")}
            onMouseLeave={() => setHoveredButton(null)}
            className={`relative p-3 rounded-full transition-all duration-200 flex items-center justify-center group overflow-hidden ${
              canGoPrev
                ? "cursor-pointer hover:bg-gradient-to-br hover:from-blue-400/20 hover:to-blue-500/20"
                : "opacity-30 cursor-not-allowed"
            }`}
            aria-label="Previous project"
          >
            {/* Ripple effect */}
            {hoveredButton === "prev" && canGoPrev && (
              <div className="absolute inset-0 bg-blue-400/10 rounded-full animate-pulse"></div>
            )}
            <div className="relative">
              <ChevronLeft
                size={24}
                className={`transition-all duration-200 ${
                  hoveredButton === "prev" && canGoPrev
                    ? "text-blue-600 scale-110"
                    : "text-slate-600"
                }`}
                strokeWidth={2.5}
              />
            </div>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-40 mx-1"></div>

          {/* Page Indicator - Enhanced */}
          {currentPage !== undefined && totalPages !== undefined && (
            <div className="px-4 py-2 text-sm font-bold tracking-wider">
              <div className="flex items-center gap-2">
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {currentPage}
                </div>
                <span className="text-slate-400 text-xs font-normal">/</span>
                <div className="text-slate-500">{totalPages}</div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="w-px h-6 bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-40 mx-1"></div>

          {/* Next Button */}
          <button
            onClick={onNext}
            disabled={!canGoNext}
            onMouseEnter={() => setHoveredButton("next")}
            onMouseLeave={() => setHoveredButton(null)}
            className={`relative p-3 rounded-full transition-all duration-200 flex items-center justify-center group overflow-hidden ${
              canGoNext
                ? "cursor-pointer hover:bg-gradient-to-br hover:from-purple-400/20 hover:to-purple-500/20"
                : "opacity-30 cursor-not-allowed"
            }`}
            aria-label="Next project"
          >
            {/* Ripple effect */}
            {hoveredButton === "next" && canGoNext && (
              <div className="absolute inset-0 bg-purple-400/10 rounded-full animate-pulse"></div>
            )}
            <div className="relative">
              <ChevronRight
                size={24}
                className={`transition-all duration-200 ${
                  hoveredButton === "next" && canGoNext
                    ? "text-purple-600 scale-110"
                    : "text-slate-600"
                }`}
                strokeWidth={2.5}
              />
            </div>
          </button>

          {/* Status indicator dots */}
          {currentPage !== undefined && totalPages !== undefined && (
            <div className="ml-2 pl-2 border-l border-slate-200/50 flex gap-1.5">
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i < currentPage
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 w-2"
                      : "bg-slate-300 w-1.5"
                  }`}
                ></div>
              ))}
            </div>
          )}
        </div>

        {/* Floating orbs decoration */}
        <div className="absolute -top-2 -left-4 w-8 h-8 bg-blue-400/20 rounded-full blur-md"></div>
        <div className="absolute -bottom-2 -right-4 w-8 h-8 bg-purple-400/20 rounded-full blur-md"></div>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="mt-3 text-center text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Use ← → to navigate
      </div>
    </div>
  )
}
