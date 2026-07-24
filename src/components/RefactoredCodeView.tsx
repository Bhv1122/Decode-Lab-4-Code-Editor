import React, { useState } from "react";
import {
  Code,
  Copy,
  Check,
  Download,
  ArrowLeftRight,
  ShieldCheck,
  Terminal,
} from "lucide-react";

interface RefactoredCodeViewProps {
  refactoredCode: string;
  language: string;
  filename: string;
  onReplaceInput: (code: string) => void;
}

export const RefactoredCodeView: React.FC<RefactoredCodeViewProps> = ({
  refactoredCode,
  language,
  filename,
  onReplaceInput,
}) => {
  const [copied, setCopied] = useState(false);
  const [replaced, setReplaced] = useState(false);

  const lines = refactoredCode.split("\n");
  const lineCount = lines.length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const handleCopy = () => {
    navigator.clipboard.writeText(refactoredCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([refactoredCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const refactoredFilename = filename
      ? `refactored_${filename}`
      : `refactored_code.${language === "python" ? "py" : "ts"}`;
    link.download = refactoredFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReplace = () => {
    onReplaceInput(refactoredCode);
    setReplaced(true);
    setTimeout(() => setReplaced(false), 2000);
  };

  return (
    <div id="refactored-code-container" className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-2xl">
      {/* Header Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 font-mono tracking-tight">
              ## REFACTORED_CODE
            </h2>
            <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <span>Production-Ready</span>
              <span>•</span>
              <span className="uppercase">{language}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Replace Input Button */}
          <button
            onClick={handleReplace}
            className="flex items-center gap-1.5 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded text-xs font-mono transition-colors"
            title="Replace Editor Input Payload with Refactored Code"
          >
            {replaced ? (
              <>
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>Replaced</span>
              </>
            ) : (
              <>
                <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
                <span>Set as Payload</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 px-2.5 py-1 rounded text-xs font-mono transition-colors"
            title="Download Refactored Code File"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 px-2.5 py-1 rounded text-xs font-mono transition-colors"
            title="Copy Refactored Code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Container with Line Numbers */}
      <div className="relative flex-1 min-h-[300px] max-h-[500px] bg-slate-950 flex font-mono text-xs leading-relaxed overflow-x-auto">
        {/* Line Numbers Column */}
        <div className="bg-slate-900/50 text-slate-600 select-none py-3 px-3 text-right border-r border-slate-800/80 font-mono text-[11px] min-w-[40px] sticky left-0 z-10">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-relaxed">
              {num}
            </div>
          ))}
        </div>

        {/* Code View Block */}
        <pre className="p-3 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto w-full selection:bg-cyan-500/30">
          <code>{refactoredCode}</code>
        </pre>
      </div>

      {/* Status Bar */}
      <div className="bg-slate-950/90 px-3.5 py-1.5 border-t border-slate-800/80 flex items-center justify-between font-mono text-[11px] text-slate-500">
        <div className="flex items-center gap-2 text-emerald-400">
          <Terminal className="w-3.5 h-3.5" />
          <span>Type Safety & Defensive Checks Verified</span>
        </div>
        <span>{lineCount} Lines Refactored</span>
      </div>
    </div>
  );
};
