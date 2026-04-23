import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import "dotenv/config";
import { evaluateRules } from "./backend/lib/fraud-logic.js";
import { getAIAnalysis } from "./backend/services/ai.js";
import { dbService } from "./backend/lib/db.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/assess", async (req, res) => {
    try {
      const transaction = req.body;
      
      // Phase 1: Rules
      const ruleResult = evaluateRules(transaction);
      
      // Phase 2: AI
      const aiText = await getAIAnalysis(transaction, ruleResult);
      
      const fullResult = {
        ...ruleResult,
        aiAnalysis: aiText
      };

      // Persistence
      try {
        dbService.saveAssessment(fullResult, transaction);
      } catch (dbError) {
        console.error("DB Save Error:", dbError);
      }
      
      res.json(fullResult);
    } catch (error) {
      console.error("Assessment Error:", error);
      res.status(500).json({ error: "Internal Assessment Failure" });
    }
  });

  app.get("/api/history", (req, res) => {
    try {
      const history = dbService.getHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      configFile: path.resolve(process.cwd(), "frontend/vite.config.ts"),
      server: { 
        middlewareMode: true,
        host: "0.0.0.0",
        port: 3000,
      },
      appType: "spa",
      root: path.resolve(process.cwd(), "frontend"),
    });
    
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "frontend/dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Calus Server operational at http://localhost:${PORT}`);
  });
}

startServer();
