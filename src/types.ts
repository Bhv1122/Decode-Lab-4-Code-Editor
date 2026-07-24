import { ComplexityMetrics } from "./utils/complexityCalculator";

export type SupportedLanguage =
  | "auto"
  | "typescript"
  | "javascript"
  | "python"
  | "java"
  | "cpp"
  | "go"
  | "json"
  | "rust"
  | "sql"
  | "csharp";

export interface AuditOptions {
  checkSyntax: boolean;
  checkLogic: boolean;
  checkPerformance: boolean;
  checkOptimization: boolean;
}

export interface BugItem {
  id: string;
  type: "syntax" | "logic" | "performance" | "smell" | "general";
  severity: "critical" | "warning" | "info";
  description: string;
  lineReference?: string;
}

export interface AuditResult {
  bugReport: BugItem[];
  bugReportRawText: string;
  refactoredCode: string;
  refactoredLanguage: string;
  rawOutput: string;
  timestamp: string;
  executionTimeMs: number;
  originalComplexity?: ComplexityMetrics;
  refactoredComplexity?: ComplexityMetrics;
}

export interface AuditHistoryEntry {
  id: string;
  filename: string;
  language: string;
  originalCode: string;
  result: AuditResult;
  timestamp: string;
}

export interface CodePreset {
  id: string;
  name: string;
  language: SupportedLanguage;
  filename: string;
  code: string;
  description: string;
}
