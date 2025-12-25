"use client";

import React from "react";

interface GlassLoaderProps {
  fullScreen?: boolean;
  message?: string;
}

export function GlassLoader({
  fullScreen = true,
  message = "Loading...",
}: GlassLoaderProps) {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Animated Rings - Creative Design */}
      <div className="relative w-20 h-20 sm:w-28 sm:h-28">
        {/* Outer orbit ring - Dark Blue */}
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-900/90 border-r-blue-800/50"
          style={{
            animation: "spin 3s linear infinite",
            boxShadow: "0 0 20px rgba(30, 58, 138, 0.6)",
          }}
        />

        {/* Middle orbit ring - Dark Blue */}
        <div
          className="absolute inset-3 rounded-full border-2 border-transparent border-b-blue-800/70 border-l-blue-900/40"
          style={{
            animation: "spin 4s linear reverse",
            boxShadow: "inset 0 0 20px rgba(30, 58, 138, 0.4)",
          }}
        />

        {/* Inner glowing core - Dark Blue Gradient */}
        <div
          className="absolute inset-6 rounded-full bg-linear-to-br from-blue-900/60 via-blue-800/40 to-transparent blur-sm"
          style={{
            animation: "pulse 2s ease-in-out infinite",
            boxShadow:
              "0 0 30px rgba(30, 58, 138, 0.6), inset 0 0 30px rgba(59, 130, 246, 0.3)",
          }}
        />

        {/* Center dot - Dark Blue */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-900 rounded-full shadow-lg shadow-blue-900/70" />
      </div>

      {/* Loading text with gradient */}
      {message && (
        <div className="text-center space-y-3">
          <p className="text-base sm:text-lg font-semibold bg-linear-to-r from-blue-900 via-blue-800 to-blue-900 bg-clip-text text-transparent animate-pulse">
            {message}
          </p>

          {/* Animated dots - Dark Blue */}
          <div className="flex gap-2 justify-center">
            <span
              className="w-2 h-2 rounded-full bg-linear-to-r from-blue-900 to-blue-800"
              style={{
                animation: "bounce 1.4s infinite",
                animationDelay: "0s",
              }}
            />
            <span
              className="w-2 h-2 rounded-full bg-linear-to-r from-blue-800 to-blue-900"
              style={{
                animation: "bounce 1.4s infinite",
                animationDelay: "0.2s",
              }}
            />
            <span
              className="w-2 h-2 rounded-full bg-linear-to-r from-blue-900 to-blue-800"
              style={{
                animation: "bounce 1.4s infinite",
                animationDelay: "0.4s",
              }}
            />
          </div>
        </div>
      )}

      {/* Animated background orbs (decorative) */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic gradient background - Lightened */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-900/25 via-blue-900/10 to-slate-900/25 backdrop-blur-lg" />

        {/* Animated background orbs */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-500/15 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-400/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Main glass container - Perfectly centered */}
        <div className="relative flex items-center justify-center px-4 sm:px-6">
          <div
            className="relative bg-white/8 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl animate-in fade-in duration-500"
            style={{
              boxShadow:
                "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 32px rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-blue-500/10 via-transparent to-blue-600/10 pointer-events-none" />

            {/* Content */}
            <div className="relative">{loaderContent}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center min-h-screen">
      {/* Inline loader - centered on page */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Glass card container */}
        <div
          className="bg-white/8 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border border-white/20 shadow-xl"
          style={{
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}
        >
          <div className="bg-linear-to-br from-blue-500/10 via-transparent to-blue-600/10 rounded-2xl p-8">
            {loaderContent}
          </div>
        </div>
      </div>
    </div>
  );
}
