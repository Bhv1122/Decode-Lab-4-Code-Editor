import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { CodeInput } from "./components/CodeInput";
import { AuditScopeSelector } from "./components/AuditScopeSelector";
import { BugReportView } from "./components/BugReportView";
import { RefactoredCodeView } from "./components/RefactoredCodeView";
import { CodeDiffView } from "./components/CodeDiffView";
import { AuditHistoryModal } from "./components/AuditHistoryModal";

import {
  AuditOptions,
  AuditResult,
  AuditHistoryEntry,
  SupportedLanguage,
  CodePreset,
} from "./types";
import { CODE_PRESETS } from "./data/presets";
import { parseAuditResponse } from "./utils/auditParser";

import {
  ShieldAlert,
  Sparkles,
  Columns2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Activity,
  Terminal,
} from "lucide-react";

export default function App() {
  // Input State
  const [code, setCode] = useState<string>(CODE_PRESETS[0].code);
  const [filename, setFilename] = useState<string>(CODE_PRESETS[0].filename);
  const [language, setLanguage] = useState<SupportedLanguage>(
    CODE_PRESETS[0].language
  );

  // Options State
  const [auditOptions, setAuditOptions] = useState<AuditOptions>({
    checkSyntax: true,
    checkLogic: true,
    checkPerformance: true,
    checkOptimization: true,
  });

  // Result & Execution State
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // UI Tabs & Views
  const [activeTab, setActiveTab] = useState<"audit" | "diff" | "raw">("audit");
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // History State
  const [history, setHistory] = useState<AuditHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem("gatekeeper_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history
  useEffect(() => {
    try {
      localStorage.setItem("gatekeeper_history", JSON.stringify(history));
    } catch (e) {
      console.warn("Unable to save audit history to localStorage:", e);
    }
  }, [history]);

  // Execute Code Audit
  const handleExecuteAudit = useCallback(async () => {
    if (!code.trim() || isExecuting) return;

    setIsExecuting(true);
    setErrorMessage(null);
    const startTime = performance.now();

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          filename,
          language,
          options: auditOptions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to execute static code audit.");
      }

      const duration = Math.round(performance.now() - startTime);
      const parsedResult = parseAuditResponse(data.rawOutput, duration);

      setAuditResult(parsedResult);
      setActiveTab("audit");

      // Save to History
      const newEntry: AuditHistoryEntry = {
        id: `audit-${Date.now()}`,
        filename: filename || "code_payload",
        language,
        originalCode: code,
        result: parsedResult,
        timestamp: new Date().toLocaleTimeString(),
      };

      setHistory((prev) => [newEntry, ...prev.slice(0, 19)]);
    } catch (err: any) {
      console.error("Audit error:", err);
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsExecuting(false);
    }
  }, [code, filename, language, auditOptions, isExecuting]);

  // Keyboard shortcut listener (Cmd/Ctrl + Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleExecuteAudit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleExecuteAudit]);

  const handleSelectPreset = (preset: CodePreset) => {
    setCode(preset.code);
    setFilename(preset.filename);
    setLanguage(preset.language);
    setErrorMessage(null);
  };

  const handleSelectHistoryEntry = (entry: AuditHistoryEntry) => {
    setCode(entry.originalCode);
    setFilename(entry.filename);
    setLanguage(entry.language as SupportedLanguage);
    setAuditResult(entry.result);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 antialiased">
      {/* Top Navigation Header */}
      <Header
        onSelectPreset={handleSelectPreset}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        isExecuting={isExecuting}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 py-5 flex-1 flex flex-col gap-5">
        {/* Scope Checklist Configuration */}
        <AuditScopeSelector options={auditOptions} onChange={setAuditOptions} />

        {/* Error Banner if any */}
        {errorMessage && (
          <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-mono shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 uppercase font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Grid Layout: Left Code Input Payload, Right Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Left Column: Code Input Editor */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span className="uppercase font-bold tracking-wider flex items-center gap-1.5 text-cyan-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>01. RAW_CODE_PAYLOAD</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Supports .py, .js, .ts, .java, .cpp, .go, .json
              </span>
            </div>

            <CodeInput
              code={code}
              setCode={setCode}
              filename={filename}
              setFilename={setFilename}
              language={language}
              setLanguage={setLanguage}
              onExecuteAudit={handleExecuteAudit}
              isExecuting={isExecuting}
            />
          </div>

          {/* Right Column: Gatekeeper Audit Results Output */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span className="uppercase font-bold tracking-wider flex items-center gap-1.5 text-emerald-400">
                <Activity className="w-3.5 h-3.5" />
                <span>02. AUDIT_VERDICT_OUTPUT</span>
              </span>

              {/* View Tabs */}
              {auditResult && (
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px]">
                  <button
                    onClick={() => setActiveTab("audit")}
                    className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                      activeTab === "audit"
                        ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>Report & Code</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("diff")}
                    className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                      activeTab === "diff"
                        ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Columns2 className="w-3 h-3 text-cyan-400" />
                    <span>Payload Diff</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("raw")}
                    className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                      activeTab === "raw"
                        ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <FileText className="w-3 h-3 text-cyan-400" />
                    <span>Raw Output</span>
                  </button>
                </div>
              )}
            </div>

            {/* Content Display */}
            {isExecuting ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center font-mono min-h-[450px]">
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-xl animate-bounce">
                    <Activity className="w-8 h-8 animate-spin" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-100">
                  EXECUTING DEEP STATIC CODE ANALYSIS
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Checking lexical syntax, logical vulnerabilities, memory leaks, and type definitions...
                </p>
              </div>
            ) : auditResult ? (
              activeTab === "audit" ? (
                <div className="flex flex-col gap-4">
                  {/* Bug Report Card */}
                  <BugReportView
                    bugReport={auditResult.bugReport}
                    rawText={auditResult.bugReportRawText}
                  />

                  {/* Refactored Code Card */}
                  <RefactoredCodeView
                    refactoredCode={auditResult.refactoredCode}
                    language={auditResult.refactoredLanguage}
                    filename={filename}
                    onReplaceInput={(newCode) => {
                      setCode(newCode);
                    }}
                  />
                </div>
              ) : activeTab === "diff" ? (
                <CodeDiffView
                  originalCode={code}
                  refactoredCode={auditResult.refactoredCode}
                  filename={filename}
                />
              ) : (
                /* Raw Text Output */
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs leading-relaxed text-slate-300 overflow-y-auto max-h-[600px] whitespace-pre-wrap">
                  {auditResult.rawOutput}
                </div>
              )
            ) : (
              /* Initial Empty State Prompt */
              <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-xl p-10 text-center flex flex-col items-center justify-center font-mono min-h-[450px]">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-200">
                  GATEKEEPER STANDBY
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                  Paste a raw code payload or load a benchmark preset on the left, then click{" "}
                  <strong className="text-cyan-400">EXECUTE AUDIT</strong> to perform static code analysis.
                </p>
                <button
                  onClick={handleExecuteAudit}
                  disabled={!code.trim()}
                  className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Audit Sample Payload Now
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* History Drawer Modal */}
      <AuditHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectEntry={handleSelectHistoryEntry}
        onClearHistory={() => setHistory([])}
      />
    </div>
  );
}
