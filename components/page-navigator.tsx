"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { useCallback, useState, useEffect } from "react";

export function PageNavigator() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Check if browser navigation is available
  useEffect(() => {
    // Note: In Next.js client-side routing, we can't directly check history
    // but we can track navigation states
    const handlePopState = () => {
      setCanGoBack(window.history.length > 1);
    };

    // Set initial state
    setCanGoBack(window.history.length > 1);

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Handle scroll detection
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY + 10) {
        // Scrolling down (with 10px threshold to avoid flicker)
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);

      // Clear existing timeout
      clearTimeout(scrollTimeout);

      // Show navigator after scroll stops for 500ms
      scrollTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [lastScrollY]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleForward = useCallback(() => {
    router.forward();
  }, [router]);

  const handleHome = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <div
      className={`transition-all duration-500 ease-out transform ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-center gap-3 bg-linear-to-r from-blue-50/80 via-white/80 to-cyan-50/80 dark:from-slate-800/80 dark:via-slate-900/80 dark:to-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-blue-200/40 dark:border-blue-900/30 px-6 py-3 hover:shadow-xl transition-shadow duration-300">
        {/* Back Button */}
        <button
          onClick={handleBack}
          disabled={!canGoBack}
          onMouseEnter={() => setIsHovered("back")}
          onMouseLeave={() => setIsHovered(null)}
          className={`relative p-2.5 rounded-lg transition-all duration-300 group ${
            canGoBack
              ? "hover:bg-blue-100/60 dark:hover:bg-blue-950/40 cursor-pointer"
              : "opacity-30 cursor-not-allowed"
          }`}
          title="Go back"
        >
          <ChevronLeft
            className={`w-5 h-5 transition-all duration-300 ${
              isHovered === "back" && canGoBack
                ? "text-blue-600 dark:text-blue-400 -translate-x-0.5"
                : "text-slate-600 dark:text-slate-400"
            } ${!canGoBack ? "opacity-50" : ""}`}
          />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-linear-to-b from-transparent via-blue-300/40 to-transparent dark:via-blue-700/40" />

        {/* Home Button - Center Focus */}
        <button
          onClick={handleHome}
          onMouseEnter={() => setIsHovered("home")}
          onMouseLeave={() => setIsHovered(null)}
          className="relative p-2.5 rounded-lg transition-all duration-300 group"
          title="Go to Dashboard"
        >
          <div className="relative flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                isHovered === "home"
                  ? "bg-linear-to-br from-blue-400/30 to-cyan-400/20 scale-100"
                  : "bg-linear-to-br from-blue-400/0 to-cyan-400/0 scale-75"
              }`}
            />
            <Home
              className={`w-5 h-5 relative transition-all duration-300 ${
                isHovered === "home"
                  ? "text-blue-600 dark:text-blue-400 scale-110"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            />
          </div>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-linear-to-b from-transparent via-blue-300/40 to-transparent dark:via-blue-700/40" />

        {/* Forward Button */}
        <button
          onClick={handleForward}
          disabled={!canGoForward}
          onMouseEnter={() => setIsHovered("forward")}
          onMouseLeave={() => setIsHovered(null)}
          className={`relative p-2.5 rounded-lg transition-all duration-300 group ${
            canGoForward
              ? "hover:bg-blue-100/60 dark:hover:bg-blue-950/40 cursor-pointer"
              : "opacity-30 cursor-not-allowed"
          }`}
          title="Go forward"
        >
          <ChevronRight
            className={`w-5 h-5 transition-all duration-300 ${
              isHovered === "forward" && canGoForward
                ? "text-blue-600 dark:text-blue-400 translate-x-0.5"
                : "text-slate-600 dark:text-slate-400"
            } ${!canGoForward ? "opacity-50" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
