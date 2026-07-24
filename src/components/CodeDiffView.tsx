import React, { useState } from "react";
import { ArrowLeftRight, Columns2, SquareCode, Check, Copy } from "lucide-react";

interface CodeDiffViewProps {
  originalCode: string;
  refactoredCode: string;
  filename: string;
}

export const CodeDiffView: React.FC<CodeDiffViewProps> = ({
  originalCode,
  refactoredCode,
  filename,
}) => {
  const [viewMode, setViewMode] = useState<"side-by-side" | "unified">("side-by-side");
  const [copied, setCopied] = useState(false);

  const origLines = originalCode.split("\n");
  const refactorLines = refactoredCode.split("\n");

  const origCount = origLines.length;
  const refactorCount = refactorLines.length;
  const lineDiff = refactorCount - origCount;

  return (
    <div id="code-diff-container" className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono text-xs">
      {/* Diff Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200">PAYLOAD_DIFF_VIEW</span>
          <span className="text-slate-500 text-[11px]">[{filename}]</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="text-rose-400">Original: {origCount} lines</span>
            <span>→</span>
            <span className="text-emerald-400">Refactored: {refactorCount} lines</span>
            <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">
              {lineDiff >= 0 ? `+${lineDiff}` : `${lineDiff}`}
            </span>
          </div>

          {/* Toggle Mode */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[11px]">
            <button
              onClick={() => setViewMode("side-by-side")}
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
                viewMode === "side-by-side"
                  ? "bg-slate-800 text-cyan-400 font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Columns2 className="w-3 h-3" />
              <span>Split</span>
            </button>
            <button
              onClick={() => setViewMode("unified")}
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
                viewMode === "unified"
                  ? "bg-slate-800 text-cyan-400 font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <SquareCode className="w-3 h-3" />
              <span>Unified</span>
            </button>
          </div>
        </div>
      </div>

      {/* Diff Content */}
      {viewMode === "side-by-side" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 max-h-[500px] overflow-y-auto bg-slate-950">
          {/* Left: Original Code */}
          <div className="flex flex-col">
            <div className="bg-rose-950/20 text-rose-400 px-3 py-1.5 text-[11px] font-bold border-b border-rose-500/20 flex justify-between">
              <span>RAW ORIGINAL PAYLOAD</span>
              <span>{origCount} lines</span>
            </div>
            <div className="p-3 overflow-x-auto text-slate-400">
              {origLines.map((line, idx) => (
                <div key={idx} className="flex gap-2 hover:bg-slate-900/60 leading-relaxed font-mono">
                  <span className="text-slate-600 select-none min-w-[28px] text-right font-mono text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Refactored Code */}
          <div className="flex flex-col">
            <div className="bg-emerald-950/20 text-emerald-400 px-3 py-1.5 text-[11px] font-bold border-b border-emerald-500/20 flex justify-between">
              <span>OPTIMIZED REFACTORED CODE</span>
              <span>{refactorCount} lines</span>
            </div>
            <div className="p-3 overflow-x-auto text-slate-200">
              {refactorLines.map((line, idx) => (
                <div key={idx} className="flex gap-2 hover:bg-slate-900/60 leading-relaxed font-mono">
                  <span className="text-slate-600 select-none min-w-[28px] text-right font-mono text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Unified View */
        <div className="max-h-[500px] overflow-y-auto bg-slate-950 p-3 space-y-1 font-mono">
          <div className="text-slate-500 text-[11px] mb-2 border-b border-slate-800 pb-1">
            --- Raw Payload vs Refactored Code Delta ---
          </div>
          {refactorLines.map((line, idx) => (
            <div
              key={idx}
              className={`flex gap-3 px-2 py-0.5 rounded leading-relaxed text-xs ${
                idx < origLines.length && origLines[idx] !== line
                  ? "bg-emerald-950/30 text-emerald-300 border-l-2 border-emerald-400"
                  : "text-slate-300"
              }`}
            >
              <span className="text-slate-600 select-none min-w-[32px] text-right font-mono text-[10px]">
                {idx + 1}
              </span>
              <span className="whitespace-pre">{line}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
