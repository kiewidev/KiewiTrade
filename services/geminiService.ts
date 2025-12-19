
import { GoogleGenAI } from "@google/genai";
import { Trade, AnalyticsSummary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeTradePerformance(trade: Trade) {
  const prompt = `
    Analyze this specific trade from a professional trading coach perspective.
    Trade Details:
    Symbol: ${trade.symbol}
    Side: ${trade.side}
    PnL: $${trade.pnlNet.toFixed(2)}
    Entry: $${trade.avgEntryPrice.toFixed(2)}
    Exit: $${trade.avgExitPrice.toFixed(2)}
    Duration: ${Math.floor((new Date(trade.closeDatetime).getTime() - new Date(trade.openDatetime).getTime()) / 60000)} minutes

    Provide 3 concise bullet points:
    1. Execution quality.
    2. Potential psychological pitfall for this trade.
    3. One improvement for the next similar setup.
    Keep it professional, direct, and under 150 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating analysis. Check your connection.";
  }
}

export async function getGeneralCoaching(summary: AnalyticsSummary) {
  const prompt = `
    As a senior risk manager, review these stats:
    Win Rate: ${(summary.winRate * 100).toFixed(1)}%
    Profit Factor: ${summary.profitFactor.toFixed(2)}
    Expectancy: $${summary.expectancy.toFixed(2)}
    Max Drawdown: $${summary.maxDrawdown.toFixed(2)}
    Total Trades: ${summary.totalTrades}

    Give a high-level verdict on the trader's sustainability and one primary focus area to increase profitability.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "The markets are quiet. No coaching available right now.";
  }
}
