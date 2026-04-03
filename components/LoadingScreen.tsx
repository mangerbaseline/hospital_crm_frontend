"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard } from "lucide-react";

export default function LoadingScreen({ isExiting }: { isExiting: boolean }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center bg-background transition-all duration-700 ease-in-out ${
        isExiting
          ? "opacity-0 scale-105"
          : "opacity-100 scale-100 animate-in fade-in duration-300"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-foreground/3 rounded-full blur-3xl loading-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-foreground/4 rounded-full blur-3xl loading-float-slow-reverse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-foreground/2 rounded-full blur-3xl loading-pulse-slow" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        <div className="relative w-32 h-32">
          <svg
            viewBox="0 0 120 120"
            className="absolute inset-0 w-full h-full loading-spin-very-slow"
          >
            <circle
              cx="60"
              cy="60"
              r="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="8 6"
              opacity="0.15"
            />
          </svg>

          <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full">
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.1"
              className="loading-pulse-ring"
            />
          </svg>

          <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g
              filter="url(#glow)"
              className="loading-cross-pulse fill-blue-500"
            >
              <rect
                x="50"
                y="32"
                width="20"
                height="56"
                rx="4"
                opacity="0.85"
              />
              <rect
                x="32"
                y="50"
                width="56"
                height="20"
                rx="4"
                opacity="0.85"
              />
            </g>
          </svg>

          <svg
            viewBox="0 0 200 40"
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-10"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 L40,20 L50,20 L60,8 L70,32 L80,4 L90,36 L100,20 L110,20 L200,20"
              fill="none"
              // stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.25"
              className="loading-heartbeat-draw stroke-red-600"
            />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background">
              <LayoutDashboard className="h-5 w-5 text-foreground " />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Hospital CRM
            </h2>
          </div>
          {/* <p className="text-sm text-muted-foreground font-medium min-w-[140px] text-center">
            Preparing your workspace{dots}
          </p> */}
        </div>

        {/* <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-foreground/80 rounded-full loading-bar" />
        </div> */}
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-25px) translateX(5px);
          }
        }
        @keyframes float-slow-reverse {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(15px) translateX(-10px);
          }
          50% {
            transform: translateY(5px) translateX(15px);
          }
          75% {
            transform: translateY(20px) translateX(-5px);
          }
        }
        @keyframes spin-very-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse-ring {
          0%,
          100% {
            transform-origin: center;
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform-origin: center;
            transform: scale(1.08);
            opacity: 0.25;
          }
        }
        @keyframes cross-pulse {
          0%,
          100% {
            opacity: 0.75;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes heartbeat-draw {
          0% {
            stroke-dashoffset: 400;
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -400;
          }
        }
        @keyframes loading-bar {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          30% {
            width: 40%;
            margin-left: 10%;
          }
          60% {
            width: 30%;
            margin-left: 50%;
          }
          100% {
            width: 10%;
            margin-left: 100%;
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        :global(.loading-float-slow) {
          animation: float-slow 8s ease-in-out infinite;
        }
        :global(.loading-float-slow-reverse) {
          animation: float-slow-reverse 10s ease-in-out infinite;
        }
        :global(.loading-spin-very-slow) {
          animation: spin-very-slow 20s linear infinite;
        }
        :global(.loading-pulse-ring) {
          animation: pulse-ring 2s ease-in-out infinite;
        }
        :global(.loading-cross-pulse) {
          animation: cross-pulse 2s ease-in-out infinite;
        }
        :global(.loading-heartbeat-draw) {
          stroke-dasharray: 400;
          animation: heartbeat-draw 2.5s ease-in-out infinite;
        }
        :global(.loading-bar) {
          animation: loading-bar 1.8s ease-in-out infinite;
        }
        :global(.loading-pulse-slow) {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
