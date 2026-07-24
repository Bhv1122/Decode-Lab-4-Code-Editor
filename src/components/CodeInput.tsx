import React, { useRef, useState } from "react";
import { SupportedLanguage } from "../types";
import {
  Code,
  Upload,
  Trash2,
  Play,
  FileCode,
  FileText,
  Sparkles,
  Layers,
} from "lucide-react";

interface CodeInputProps {
  code: string;
  setCode: (code: string) => void;
  filename: string;
  setFilename: (name: string) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  onExecuteAudit: () => void;
  isExecuting: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({
  code,
  setCode,
  filename,
  setFilename,
  language,
  setLanguage,
  onExecuteAudit,
  isExecuting,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Line counter
  const lineCount = code ? code.split("\n").length : 1;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Metrics
  const charCount = code.length;
  const approxTokens = Math.ceil(charCount / 4);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    setFilename(file.name);
    
    // Infer language from extension
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "py") setLanguage("python");
    else if (ext === "ts" || ext === "tsx") setLanguage("typescript");
    else if (ext === "js" || ext === "jsx") setLanguage("javascript");
    else if (ext === "java") setLanguage("java");
    else if (ext === "cpp" || ext === "c" || ext === "h" || ext === "hpp") setLanguage("cpp");
    else if (ext === "go") setLanguage("go");
    else if (ext === "json") setLanguage("json");
    else if (ext === "rs") setLanguage("rust");
    else if (ext === "sql") setLanguage("sql");
    else if (ext === "cs") setLanguage("csharp");

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setCode(text);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  return (
    <div
      id="code-input-container"
      className={`bg-slate-900 border rounded-xl overflow-hidden flex flex-col transition-all shadow-2xl ${
        isDragging ? "border-cyan-400 ring-2 ring-cyan-500/20" : "border-slate-800"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Editor Header Bar */}
      <div className="bg-slate-950 px-3.5 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="filename.ts"
            className="bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-200 px-2 py-1 rounded text-xs w-36 font-mono outline-none"
          />
          <span className="text-slate-600">|</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-mono outline-none cursor-pointer focus:border-cyan-500"
          >
            <option value="auto">Auto Detect</option>
            <option value="typescript">TypeScript (.ts)</option>
            <option value="javascript">JavaScript (.js)</option>
            <option value="python">Python (.py)</option>
            <option value="java">Java (.java)</option>
            <option value="cpp">C++ (.cpp)</option>
            <option value="go">Go (.go)</option>
            <option value="json">JSON (.json)</option>
            <option value="rust">Rust (.rs)</option>
            <option value="sql">SQL (.sql)</option>
            <option value="csharp">C# (.cs)</option>
          </select>
        </div>

        {/* Toolbar & Controls */}
        <div className="flex items-center gap-2">
          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".py,.js,.ts,.tsx,.jsx,.java,.cpp,.go,.json,.rs,.sql,.cs,.txt"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 px-2.5 py-1 rounded text-xs font-mono transition-colors"
            title="Upload Raw Payload File"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Clear Button */}
          {code && (
            <button
              type="button"
              onClick={() => setCode("")}
              className="flex items-center gap-1 bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700/60 px-2 py-1 rounded text-xs font-mono transition-colors"
              title="Clear Editor"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Primary Gatekeeper Execute Audit Button */}
          <button
            id="execute-audit-btn"
            type="button"
            onClick={onExecuteAudit}
            disabled={isExecuting || !code.trim()}
            className={`flex items-center gap-2 font-mono text-xs font-bold px-4 py-1.5 rounded-lg border shadow-lg transition-all ${
              isExecuting || !code.trim()
                ? "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-400 hover:shadow-cyan-500/20 active:scale-95 cursor-pointer"
            }`}
          >
            {isExecuting ? (
              <>
                <Layers className="w-3.5 h-3.5 animate-spin" />
                <span>AUDITING...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>EXECUTE AUDIT</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Textarea Area with Line Numbers */}
      <div className="relative flex-1 min-h-[360px] max-h-[550px] bg-slate-950 flex font-mono text-xs leading-relaxed">
        {/* Line Numbers Column */}
        <div className="bg-slate-900/50 text-slate-600 select-none py-3 px-3 text-right border-r border-slate-800/80 font-mono text-[11px] min-w-[40px] sticky left-0 z-10">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-relaxed">
              {num}
            </div>
          ))}
        </div>

        {/* Text Area Input */}
        <textarea
          id="raw-code-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Paste or drop raw code payload here (.py, .js, .ts, .java, .cpp, .go, .json)..."
          spellCheck={false}
          className="w-full h-full bg-transparent text-slate-200 p-3 outline-none resize-none font-mono text-xs leading-relaxed focus:bg-slate-950/80 overflow-y-auto"
        />

        {/* Drag and Drop Overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-slate-950/90 border-2 border-dashed border-cyan-400 flex flex-col items-center justify-center text-cyan-400 z-20 font-mono">
            <Upload className="w-10 h-10 mb-2 animate-bounce" />
            <p className="text-sm font-bold">Drop Raw Code File Payload</p>
            <p className="text-xs text-slate-400 mt-1">
              Supports .py, .js, .ts, .java, .cpp, .go, .json, .rs, .sql
            </p>
          </div>
        )}
      </div>

      {/* Editor Footer Stats Bar */}
      <div className="bg-slate-950/90 px-3.5 py-1.5 border-t border-slate-800/80 flex items-center justify-between font-mono text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span>{lineCount} Lines</span>
          <span>•</span>
          <span>{charCount} Chars</span>
          <span>•</span>
          <span>~{approxTokens} Tokens</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Press Cmd/Ctrl + Enter to Execute</span>
        </div>
      </div>
    </div>
  );
};
