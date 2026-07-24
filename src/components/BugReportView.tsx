import React, { useState } from "react";
import { BugItem } from "../types";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Copy,
  Check,
  ShieldX,
  CheckCircle2,
  Filter,
} from "lucide-react";

interface BugReportViewProps {
  bugReport: BugItem[];
  rawText: string;
}

export const BugReportView: React.FC<BugReportViewProps> = ({
  bugReport,
  rawText,
}) => {
  const [copied, setCopied] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const handleCopy = () => {
    navigator.clipboard.writeText(`## BUG_REPORT\n${rawText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredBugs = bugReport.filter((bug) => {
    if (filterSeverity === "all") return true;
    return bug.severity === filterSeverity;
  });

  const criticalCount = bugReport.filter((b) => b.severity === "critical").length;
  const warningCount = bugReport.filter((b) => b.severity === "warning").length;
  const infoCount = bugReport.filter((b) => b.severity === "info").length;

  return (
    <div id="bug-report-container" className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-2xl">
      {/* Header Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <ShieldX className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 font-mono tracking-tight">
              ## BUG_REPORT
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              {bugReport.length} Anomalies & Vulnerabilities Detected
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 font-mono text-[11px]">
            <button
              onClick={() => setFilterSeverity("all")}
              className={`px-2 py-0.5 rounded transition-colors ${
                filterSeverity === "all"
                  ? "bg-slate-800 text-slate-200 font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              All ({bugReport.length})
            </button>
            <button
              onClick={() => setFilterSeverity("critical")}
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
                filterSeverity === "critical"
                  ? "bg-rose-950/80 text-rose-300 font-bold border border-rose-500/30"
                  : "text-rose-400/70 hover:text-rose-400"
              }`}
            >
              <span>Critical</span>
              <span className="text-[10px]">({criticalCount})</span>
            </button>
            <button
              onClick={() => setFilterSeverity("warning")}
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
                filterSeverity === "warning"
                  ? "bg-amber-950/80 text-amber-300 font-bold border border-amber-500/30"
                  : "text-amber-400/70 hover:text-amber-400"
              }`}
            >
              <span>Warn</span>
              <span className="text-[10px]">({warningCount})</span>
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 px-2.5 py-1 rounded text-xs font-mono transition-colors"
            title="Copy Raw Bug Report"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* List Content */}
      <div className="p-4 overflow-y-auto max-h-[500px] space-y-3 font-sans">
        {filteredBugs.length === 0 ? (
          <div className="text-center py-10 font-mono text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500/40 mx-auto mb-2" />
            <p className="text-sm font-semibold">No issues matching filter.</p>
          </div>
        ) : (
          filteredBugs.map((bug) => {
            let bgClass = "bg-slate-950/70 border-slate-800/80";
            let badgeClass = "bg-slate-800 text-slate-400 border-slate-700";
            let Icon = Info;

            if (bug.severity === "critical") {
              bgClass = "bg-rose-950/20 border-rose-500/30 text-rose-200";
              badgeClass = "bg-rose-500/10 text-rose-400 border-rose-500/30";
              Icon = AlertCircle;
            } else if (bug.severity === "warning") {
              bgClass = "bg-amber-950/20 border-amber-500/30 text-amber-200";
              badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/30";
              Icon = AlertTriangle;
            }

            return (
              <div
                key={bug.id}
                className={`p-3.5 rounded-xl border ${bgClass} transition-all hover:border-slate-700`}
              >
                <div className="flex items-start gap-2.5">
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${
                    bug.severity === "critical"
                      ? "text-rose-400"
                      : bug.severity === "warning"
                      ? "text-amber-400"
                      : "text-cyan-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${badgeClass}`}>
                        {bug.severity}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        [{bug.type}]
                      </span>
                      {bug.lineReference && (
                        <span className="text-[10px] font-mono bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded border border-slate-700">
                          {bug.lineReference}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-slate-200 leading-relaxed break-words">
                      {bug.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
