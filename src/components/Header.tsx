import React from "react";
import { ShieldCheck, Cpu, Terminal, History, Sparkles, Code2 } from "lucide-react";
import { CODE_PRESETS } from "../data/presets";
import { CodePreset } from "../types";

interface HeaderProps {
  onSelectPreset: (preset: CodePreset) => void;
  onOpenHistory: () => void;
  historyCount: number;
  isExecuting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onOpenHistory,
  historyCount,
  isExecuting,
}) => {
  return (
    <header id="gatekeeper-header" className="bg-slate-950 border-b border-slate-800 px-4 py-3 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner shadow-cyan-500/10">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-100 tracking-tight font-mono">
                CODE_QUALITY_GATEKEEPER
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold font-mono uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
                v2.5 • AI Gate
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Automated Static Analyzer & Deep Code Auditor</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Presets */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Preset Selector */}
          <div className="relative group">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:border-slate-500 transition-colors cursor-pointer font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Load Buggy Preset...</span>
            </div>
            <div className="absolute right-0 top-full mt-1.5 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
              <div className="text-[11px] font-mono text-slate-400 px-2.5 py-1 uppercase tracking-wider border-b border-slate-800/80 mb-1">
                Benchmark Sample Payloads
              </div>
              <div className="space-y-1">
                {CODE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPreset(preset)}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 transition-colors group/item"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200 font-mono group-hover/item:text-cyan-400">
                      <span>{preset.name}</span>
                      <Code2 className="w-3 h-3 text-slate-500 group-hover/item:text-cyan-400" />
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* History Button */}
          <button
            id="history-toggle-btn"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors relative"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Audit Logs</span>
            {historyCount > 0 && (
              <span className="bg-cyan-500/20 text-cyan-300 font-bold px-1.5 py-0.2 rounded-full text-[10px] border border-cyan-500/30">
                {historyCount}
              </span>
            )}
          </button>

          {/* System Status Badge */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                isExecuting ? "bg-amber-400 animate-ping" : "bg-emerald-400"
              }`}
            />
            <span className="text-slate-300">
              {isExecuting ? "ANALYZING..." : "GATE_READY"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
