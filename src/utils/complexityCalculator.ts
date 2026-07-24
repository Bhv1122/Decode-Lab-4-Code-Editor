export interface ComplexityMetrics {
  score: number;
  level: "low" | "moderate" | "high" | "critical";
  label: string;
  maintainabilityIndex: number; // 0 - 100
  linesOfCode: number;
  decisionPointsCount: number;
  breakdown: {
    branches: number; // if, elif, case, switch
    loops: number; // for, while, do
    logicalOps: number; // &&, ||, and, or
    exceptions: number; // catch, except
    ternaries: number; // ?, ??
  };
}

export function stripCommentsAndStrings(code: string): string {
  if (!code) return "";
  // Strip block comments /* ... */ and triple quotes """ ... """
  let cleaned = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/"""[\s\S]*?"""/g, "");
  // Strip single-line comments // ... and # ...
  cleaned = cleaned.replace(/\/\/.*/g, "").replace(/#.*/g, "");
  // Strip string literals "..." and '...' and `...`
  cleaned = cleaned.replace(/"([^"\\]|\\.)*"/g, '""').replace(/'([^'\\]|\\.)*'/g, "''").replace(/`([^`\\]|\\.)*`/g, "``");
  return cleaned;
}

export function calculateCyclomaticComplexity(code: string): ComplexityMetrics {
  if (!code || !code.trim()) {
    return {
      score: 1,
      level: "low",
      label: "Minimal Complexity (1)",
      maintainabilityIndex: 100,
      linesOfCode: 0,
      decisionPointsCount: 0,
      breakdown: {
        branches: 0,
        loops: 0,
        logicalOps: 0,
        exceptions: 0,
        ternaries: 0,
      },
    };
  }

  const lines = code.split("\n");
  const linesOfCode = lines.filter((l) => l.trim().length > 0).length;

  const cleaned = stripCommentsAndStrings(code);

  // Match breakdown
  const branches = (cleaned.match(/\b(if|elif|else\s+if|case|switch)\b/g) || []).length;
  const loops = (cleaned.match(/\b(for|while|do)\b/g) || []).length;
  const logicalOps = (cleaned.match(/(&&|\|\||\band\b|\bor\b)/g) || []).length;
  const exceptions = (cleaned.match(/\b(catch|except)\b/g) || []).length;
  const ternaries = (cleaned.match(/(\?|\?\?)/g) || []).length;

  const decisionPointsCount = branches + loops + logicalOps + exceptions + ternaries;
  const score = decisionPointsCount + 1;

  // Level classification
  let level: "low" | "moderate" | "high" | "critical" = "low";
  let label = "Low Risk / High Maintainability";

  if (score > 20) {
    level = "critical";
    label = "Very High Complexity / High Bug Risk";
  } else if (score > 10) {
    level = "high";
    label = "High Complexity / Moderate Risk";
  } else if (score > 5) {
    level = "moderate";
    label = "Moderate Complexity";
  } else {
    level = "low";
    label = "Low Complexity / Clean & Maintainable";
  }

  // Maintainability Index (0 - 100)
  // Higher score = better maintainability
  const rawMi = 100 - score * 3.2 - linesOfCode * 0.12;
  const maintainabilityIndex = Math.max(0, Math.min(100, Math.round(rawMi)));

  return {
    score,
    level,
    label,
    maintainabilityIndex,
    linesOfCode,
    decisionPointsCount,
    breakdown: {
      branches,
      loops,
      logicalOps,
      exceptions,
      ternaries,
    },
  };
}
