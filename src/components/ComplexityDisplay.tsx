import React from "react";
import { ComplexityMetrics } from "../utils/complexityCalculator";
import { Activity, Gauge, GitFork, ShieldCheck, Zap, ArrowDownRight, Layers } from "lucide-react";

interface ComplexityDisplayProps {
  originalComplexity?: ComplexityMetrics;
  refactoredComplexity?: ComplexityMetrics;
}

export const ComplexityDisplay: React.FC<ComplexityDisplayProps> = ({
  originalComplexity,
  refactoredComplexity,
}) => {
  if (!originalComplexity) return null;

  const current = originalComplexity;
  const refactored = refactoredComplexity;

  // Level Styling
  const getLevelBadge = (level: ComplexityMetrics["level"], score: number) => {
    switch (level) {
      case "low":
        return {
          bg: "bg-emerald-950/60 border-emerald-500/40 text-emerald-300",
          text: "LOW COMPLEXITY",
          color: "text-emerald-400",
          ring: "stroke-emerald-400",
        };
      case "moderate":
        return {
          bg: "bg-amber-950/60 border-amber-500/40 text-amber-300",
          text: "MODERATE COMPLEXITY",
          color: "text-amber-400",
          ring: "stroke-amber-400",
        };
      case "high":
        return {
          bg: "bg-orange-950/60 border-orange-500/40 text-orange-300",
          text: "HIGH RISK COMPLEXITY",
          color: "text-orange-400",
          ring: "stroke-orange-400",
        };
      case "critical":
        return {
          bg: "bg-rose-950/60 border-rose-500/40 text-rose-300",
          text: "CRITICAL COMPLEXITY",
          color: "text-rose-400",
          ring: "stroke-rose-400",
        };
    }
  };

  const origBadge = getLevelBadge(current.level, current.score);

  // Delta calculation if refactored exists
  const hasRefactored = !!refactored && refactored.score > 0;
  const scoreDiff = hasRefactored ? current.score - refactored.score : 0;
  const percentReduction = hasRefactored && current.score > 0
    ? Math.round((scoreDiff / current.score) * 100)
    : 0;

  return (
    <div id="cyclomatic-complexity-display" className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono shadow-xl space-y-3">
      {/* Top Title & Score Metric Card */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 shadow-inner">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                CYCLOMATIC_COMPLEXITY_SCORE
              </h3>
              <span className="text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                V(G) Metric
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
              Objective measure of linearly independent execution paths & maintainability.
            </p>
          </div>
        </div>

        {/* Level Badge */}
        <div className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-2 ${origBadge.bg}`}>
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>{origBadge.text}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Cyclomatic Score Card */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Raw Cyclomatic Complexity</span>
            <span className="text-slate-500">V(G) = E - N + 2P</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold ${origBadge.color}`}>
              {current.score}
            </span>
            <span className="text-xs text-slate-400">
              ({current.decisionPointsCount} decision points)
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-sans">
            {current.label}
          </p>
        </div>

        {/* Maintainability Index Card */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>Maintainability Index</span>
            </span>
            <span className="text-cyan-400 font-bold">{current.maintainabilityIndex} / 100</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 my-1">
            <div
              className={`h-full transition-all duration-500 ${
                current.maintainabilityIndex >= 70
                  ? "bg-emerald-400"
                  : current.maintainabilityIndex >= 40
                  ? "bg-amber-400"
                  : "bg-rose-500"
              }`}
              style={{ width: `${current.maintainabilityIndex}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-500 font-sans">
            Higher index indicates lower maintenance overhead & easier refactoring.
          </p>
        </div>

        {/* Refactoring Delta (if available) */}
        {hasRefactored ? (
          <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-lg flex flex-col justify-between col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>REFACTORED DELTA</span>
              </span>
              <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] border border-emerald-500/30">
                Optimized
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-1">
              <span className="text-xl font-extrabold text-emerald-300">
                V(G) {refactored.score}
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-0.5 font-bold">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>-{percentReduction}% Complexity</span>
              </span>
            </div>

            <p className="text-[10px] text-emerald-400/80 font-sans">
              Maintainability improved from {current.maintainabilityIndex} to {refactored.maintainabilityIndex}.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[11px] text-slate-400">Lines of Executable Code</span>
            <span className="text-xl font-bold text-slate-200">{current.linesOfCode} LOC</span>
            <span className="text-[10px] text-slate-500 font-sans">Non-empty payload lines</span>
          </div>
        )}
      </div>

      {/* Decision Points Breakdown Chips */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-lg p-2.5">
        <div className="text-[10px] uppercase text-slate-500 font-bold mb-1.5 flex items-center gap-1">
          <Layers className="w-3 h-3 text-cyan-400" />
          <span>Decision Constructs Breakdown</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
            Branches (if/switch): <strong className="text-cyan-400">{current.breakdown.branches}</strong>
          </span>
          <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
            Loops (for/while): <strong className="text-cyan-400">{current.breakdown.loops}</strong>
          </span>
          <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
            Logical Ops (&&/||): <strong className="text-cyan-400">{current.breakdown.logicalOps}</strong>
          </span>
          <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
            Exceptions (catch): <strong className="text-cyan-400">{current.breakdown.exceptions}</strong>
          </span>
          <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
            Ternaries (?/??): <strong className="text-cyan-400">{current.breakdown.ternaries}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
