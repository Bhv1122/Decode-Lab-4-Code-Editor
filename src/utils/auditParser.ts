import { AuditResult, BugItem } from "../types";

export function parseAuditResponse(rawText: string, executionTimeMs: number): AuditResult {
  let bugReportRawText = "";
  let refactoredCode = "";
  let refactoredLanguage = "typescript";

  // Standardize header matching
  const bugReportMatch = rawText.match(/##\s*BUG_REPORT([\s\S]*?)(?=##\s*REFACTORED_CODE|$)/i);
  const refactoredCodeMatch = rawText.match(/##\s*REFACTORED_CODE([\s\S]*?)$/i);

  if (bugReportMatch) {
    bugReportRawText = bugReportMatch[1].trim();
  }

  if (refactoredCodeMatch) {
    const blockText = refactoredCodeMatch[1].trim();
    // Extract code between triple backticks ```lang ... ```
    const codeBlockMatch = blockText.match(/```([a-zA-Z0-9_+#-]*)\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      refactoredLanguage = codeBlockMatch[1] || "typescript";
      refactoredCode = codeBlockMatch[2].trim();
    } else {
      // Fallback if backticks were omitted or formatted slightly differently
      refactoredCode = blockText.replace(/^```[a-zA-Z0-9_+#-]*\n?/, "").replace(/```$/, "").trim();
    }
  }

  // Parse bug report lines into structured BugItem objects
  const bugItems: BugItem[] = [];
  const lines = bugReportRawText.split("\n").map(l => l.trim()).filter(Boolean);

  let idCounter = 1;
  for (const line of lines) {
    if (line.startsWith("*") || line.startsWith("-") || /^\d+\./.test(line)) {
      const cleanLine = line.replace(/^[\*\-\d\.\s]+/, "").trim();
      if (!cleanLine) continue;

      let severity: "critical" | "warning" | "info" = "warning";
      const lower = cleanLine.toLowerCase();

      if (
        lower.includes("critical") ||
        lower.includes("fatal") ||
        lower.includes("security") ||
        lower.includes("leak") ||
        lower.includes("null pointer") ||
        lower.includes("overflow") ||
        lower.includes("unhandled exception") ||
        lower.includes("deadlock") ||
        lower.includes("out-of-bounds")
      ) {
        severity = "critical";
      } else if (
        lower.includes("warning") ||
        lower.includes("off-by-one") ||
        lower.includes("closure") ||
        lower.includes("type") ||
        lower.includes("missing check") ||
        lower.includes("unclosed")
      ) {
        severity = "warning";
      } else {
        severity = "info";
      }

      let type: "syntax" | "logic" | "performance" | "smell" | "general" = "logic";
      if (lower.includes("syntax") || lower.includes("lexical") || lower.includes("broken loop")) {
        type = "syntax";
      } else if (lower.includes("memory") || lower.includes("performance") || lower.includes("leak")) {
        type = "performance";
      } else if (lower.includes("type") || lower.includes("smell") || lower.includes("docstring") || lower.includes("hint")) {
        type = "smell";
      }

      // Try to match line references like (Line 14) or line 10
      const lineMatch = cleanLine.match(/line\s*(\d+)/i);
      const lineReference = lineMatch ? `Line ${lineMatch[1]}` : undefined;

      bugItems.push({
        id: `bug-${idCounter++}`,
        type,
        severity,
        description: cleanLine,
        lineReference,
      });
    }
  }

  // Fallback if no bullet points were found but text exists
  if (bugItems.length === 0 && bugReportRawText.length > 0) {
    bugItems.push({
      id: "bug-1",
      type: "general",
      severity: "warning",
      description: bugReportRawText,
    });
  }

  return {
    bugReport: bugItems,
    bugReportRawText,
    refactoredCode,
    refactoredLanguage,
    rawOutput: rawText,
    timestamp: new Date().toLocaleTimeString(),
    executionTimeMs,
  };
}
