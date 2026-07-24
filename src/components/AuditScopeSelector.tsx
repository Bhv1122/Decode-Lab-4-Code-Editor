import React from "react";
import { AuditOptions } from "../types";
import { CheckSquare, Square, FileCode2, Bug, Zap, ShieldAlert } from "lucide-react";

interface AuditScopeSelectorProps {
  options: AuditOptions;
  onChange: (options: AuditOptions) => void;
}

export const AuditScopeSelector: React.FC<AuditScopeSelectorProps> = ({
  options,
  onChange,
}) => {
  const toggleOption = (key: keyof AuditOptions) => {
    onChange({
      ...options,
      [key]: !options[key],
    });
  };

  const scopeItems = [
    {
      key: "checkSyntax" as keyof AuditOptions,
      label: "Syntax & Lexical Rules",
      description: "Broken loops, syntax errors, undeclared variables",
      icon: FileCode2,
      color: "text-cyan-400",
    },
    {
      key: "checkLogic" as keyof AuditOptions,
      label: "Logical & Runtime Edge Cases",
      description: "Null pointers, off-by-one, unhandled promises/errors",
      icon: Bug,
      color: "text-rose-400",
    },
    {
      key: "checkPerformance" as keyof AuditOptions,
      label: "Performance & Memory Leaks",
      description: "Unclosed resources, dangling handles, infinite loops",
      icon: Zap,
      color: "text-amber-400",
    },
    {
      key: "checkOptimization" as keyof AuditOptions,
      label: "Type Safety & Code Smells",
      description: "Missing type hints, docstrings, defensive guards",
      icon: ShieldAlert,
      color: "text-emerald-400",
    },
  ];

  return (
    <div id="audit-scope-panel" className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 mb-4">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-mono uppercase text-slate-400 tracking-wider font-semibold">
          ANALYSIS_SCOPE_CHECKLIST
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          Enforced Objective Standards
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {scopeItems.map((item) => {
          const Icon = item.icon;
          const isChecked = options[item.key];

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleOption(item.key)}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
                isChecked
                  ? "bg-slate-800/80 border-slate-700 text-slate-200"
                  : "bg-slate-950/40 border-slate-900/80 text-slate-500 hover:border-slate-800"
              }`}
            >
              <div className="mt-0.5">
                {isChecked ? (
                  <CheckSquare className={`w-4 h-4 ${item.color}`} />
                ) : (
                  <Square className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-mono font-medium">
                  <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-sans">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
