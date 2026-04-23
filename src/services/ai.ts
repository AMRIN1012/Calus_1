/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { Transaction, AssessmentResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAIAnalysis(transaction: Transaction, ruleResult: AssessmentResult): Promise<string> {
  const prompt = `
    You are an expert financial fraud analyst. Analyze the following transaction data and the rule-based risk assessment to provide a clear, technical, and explainable analysis.
    
    TRANSACTION DATA:
    - Amount: $${transaction.amount}
    - Location: ${transaction.currentLocation} (Previous: ${transaction.previousLocation || 'N/A'})
    - Device: ${transaction.deviceType}
    - Time: ${transaction.timestamp}
    - Frequency: ${transaction.transactionsIn24h} transactions in 24h
    
    RULE-BASED ASSESSMENT:
    - Risk Score: ${ruleResult.score}/100
    - Risk Level: ${ruleResult.riskLevel}
    - Flagged Factors: ${ruleResult.factors.filter(f => f.level !== 'LOW').map(f => f.name).join(', ')}
    
    RESPONSE REQUIREMENTS:
    1. Start with a clear verdict: "[LEGITIMATE]" or "[SUSPICIOUS]" or "[FRAUDULENT]".
    2. Provide a "Behavioral Analysis" section (bullet points).
    3. Provide an "Explainable AI Insights" section (why it was flagged or cleared).
    4. Keep it concise, professional, and technical.
    5. Use markdown for formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "AI Analysis unavailable at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating AI analysis. Please check your system logs.";
  }
}
