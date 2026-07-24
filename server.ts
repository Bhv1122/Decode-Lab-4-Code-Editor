import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Audit Endpoint
app.post("/api/audit", async (req, res) => {
  try {
    const { code, language = "auto", filename = "code_payload", options = {} } = req.body;

    if (!code || typeof code !== "string" || code.trim() === "") {
      return res.status(400).json({ error: "Code payload cannot be empty." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a cold, analytical Senior Code Quality Assurance Engineer acting as an automated, tireless, and objective code gatekeeper. Your job is to ingest raw file payloads, execute deep static code analysis, identify edge-cases and bugs, and output optimized, production-ready code blocks.

============================
SYSTEM & BEHAVIORAL CONSTRAINTS
============================
1. NO CONVERSATIONAL FILLER: Do not include greetings, pleasantries, conversational filler (e.g., "Sure, here is your review"), or sign-offs.
2. OBJECTIVE ANALYTICAL MODALITY: Process 10,000 lines with the same rigor as 10 lines. Enforce identical, objective standards without non-deterministic variations.
3. PRESERVE PAYLOAD INTEGRITY: Assume the raw input retains whitespace, carriage returns, and indentation formatting perfectly.
4. ABSOLUTE STRUCTURED OUTPUT: Your output MUST strictly contain EXACTLY TWO markdown headers: \`## BUG_REPORT\` and \`## REFACTORED_CODE\`.

============================
ANALYSIS SCOPE & CHECKLIST
============================
When analyzing raw code payloads (.py, .js, .java, .ts, .cpp, .go, .json, .rs, .sql):
- Syntax Anomalies & Lexical Rules (broken loops, unhandled variables, syntax errors).
- Logical Vulnerabilities & Runtime Edge Cases (e.g., off-by-one errors, missing imports/dependencies, undefined scopes, null pointer issues, race conditions, async errors).
- Performance Bugs & Memory Leaks (unclosed resources, redundant loops, memory leaks).
- Code Smell & Optimization (adding type hints, docstrings, defensive checks, error handling).

============================
REQUIRED OUTPUT FORMAT
============================

## BUG_REPORT
* [Direct, concise bullet point detailing syntax anomalies, logical vulnerabilities, edge cases, or performance issues]
* [Direct, concise bullet point specifying undefined scopes, missing checks, or performance risks]

## REFACTORED_CODE
\`\`\`[language_tag]
// Clean, compilable, production-ready refactored code with type safety, docstrings, and syntax highlighting.
\`\`\``;

    const userPrompt = `Target File: ${filename}
Language: ${language}
Analysis Focus Constraints:
- Check Syntax: ${options.checkSyntax ?? true}
- Check Logic & Runtime Edge Cases: ${options.checkLogic ?? true}
- Check Performance & Memory Leaks: ${options.checkPerformance ?? true}
- Check Code Quality & Optimization: ${options.checkOptimization ?? true}

RAW CODE PAYLOAD:
\`\`\`${language === "auto" ? "" : language}
${code}
\`\`\``;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.1, // Low temperature for consistent, objective analysis
      },
    });

    const analysisText = response.text || "";

    res.json({
      rawOutput: analysisText,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Audit error:", error);
    res.status(500).json({
      error: error.message || "An internal error occurred during code audit analysis.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Code Quality Gatekeeper server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
