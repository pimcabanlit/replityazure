import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertValuationSchema, type ValuationResults } from "@shared/schema";
import { z } from "zod";

// Azure OpenAI configuration
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || "";
const AZURE_OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const AZURE_OPENAI_DEPLOYMENT_NAME = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o-mini";
const AZURE_SEARCH_ENDPOINT = process.env.AZURE_SEARCH_ENDPOINT || "";
const AZURE_SEARCH_INDEX_NAME = process.env.AZURE_SEARCH_INDEX_NAME || "";
const AZURE_SEARCH_KEY = process.env.AZURE_SEARCH_KEY || "";
const NODE_ENV = process.env.NODE_ENV || "development";

async function callAzureOpenAI(prompt: string): Promise<string> {
  if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_API_KEY) {
    throw new Error("Azure OpenAI configuration missing");
  }

  const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-15-preview`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': AZURE_OPENAI_API_KEY,
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: "You are a professional financial analyst specializing in business valuations. Provide detailed, accurate analysis based on the company data provided."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`Azure OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "Analysis unavailable";
}

function calculateValuation(data: any): ValuationResults {
  const revenue = data.revenue;
  const ebitda = data.ebitda;
  const growthRate = data.growthRate / 100;
  
  // Industry-specific multiples (simplified)
  const industryMultiples = {
    'Technology': { revenue: 4.2, ebitda: 15.5 },
    'Healthcare': { revenue: 3.8, ebitda: 12.3 },
    'Financial Services': { revenue: 2.9, ebitda: 11.2 },
    'Manufacturing': { revenue: 1.8, ebitda: 8.5 },
    'Retail': { revenue: 1.4, ebitda: 7.8 },
    'Other': { revenue: 2.5, ebitda: 10.0 }
  };

  const multiples = industryMultiples[data.industry as keyof typeof industryMultiples] || industryMultiples.Other;
  
  // DCF Calculation (simplified)
  const wacc = 0.10; // 10% WACC
  const terminalGrowth = 0.03; // 3% terminal growth
  const projectedCashFlow = ebitda * (1 + growthRate);
  const terminalValue = projectedCashFlow * (1 + terminalGrowth) / (wacc - terminalGrowth);
  const dcfValue = terminalValue * 0.8; // Simplified DCF

  // Market Comparables
  const compsValue = revenue * multiples.revenue * (1 - 0.3); // 30% marketability discount

  // Asset-based approach (simplified)
  const assetBasedValue = revenue * 0.8; // Simplified asset approach

  // Calculate weighted average
  const weightedValue = (dcfValue * 0.4) + (compsValue * 0.4) + (assetBasedValue * 0.2);
  const lowRange = weightedValue * 0.85;
  const highRange = weightedValue * 1.15;

  // Risk assessment calculation
  const marketRisk = Math.min(60 + (growthRate * 100 * 2), 80); // Higher growth = higher risk
  const financialRisk = Math.max(20, 50 - (ebitda / revenue * 100)); // Better margins = lower risk
  const operationalRisk = Math.min(45 + (data.employees < 20 ? 20 : data.employees < 100 ? 10 : 0), 70);
  const liquidityRisk = Math.max(20, 40 - (revenue / 1000000 * 5)); // Larger companies = more liquid

  const overallRisk = (marketRisk + financialRisk + operationalRisk + liquidityRisk) / 4;
  const confidence = Math.max(70, Math.min(95, 100 - (overallRisk - 40)));

  return {
    valuationRange: `$${(lowRange / 1000000).toFixed(1)}M - $${(highRange / 1000000).toFixed(1)}M`,
    confidence: Math.round(confidence),
    dcf: Math.round(dcfValue),
    comps: Math.round(compsValue),
    assetBased: Math.round(assetBasedValue),
    aiAnalysis: "", // Will be filled by AI
    riskAssessment: {
      marketRisk: Math.round(marketRisk),
      financialRisk: Math.round(financialRisk),
      operationalRisk: Math.round(operationalRisk),
      liquidityRisk: Math.round(liquidityRisk),
      overallScore: Math.round(overallRisk),
    },
    keyMetrics: {
      revenueMultiple: Math.round(compsValue / revenue * 10) / 10,
      ebitdaMultiple: Math.round(compsValue / ebitda * 10) / 10,
      enterpriseValue: Math.round(weightedValue),
      peRatio: Math.round((compsValue / (ebitda * 0.7)) * 10) / 10, // Simplified P/E
      pegRatio: Math.round((compsValue / (ebitda * 0.7)) / (growthRate * 100) * 10) / 10,
      priceToBook: Math.round((compsValue / assetBasedValue) * 10) / 10,
    },
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate valuation analysis
  app.post("/api/valuations", async (req, res) => {
    try {
      const validatedData = insertValuationSchema.parse(req.body);
      
      // Calculate initial valuation
      const results = calculateValuation(validatedData);
      
      // Generate AI analysis
      const aiPrompt = `
        Analyze this company for business valuation:
        
        Company: ${validatedData.companyName}
        Industry: ${validatedData.industry}
        Stage: ${validatedData.companyStage}
        Revenue: $${validatedData.revenue.toLocaleString()}
        EBITDA: $${validatedData.ebitda.toLocaleString()}
        Growth Rate: ${validatedData.growthRate}%
        Employees: ${validatedData.employees}
        
        Valuation Results:
        - DCF Value: $${results.dcf.toLocaleString()}
        - Market Comps: $${results.comps.toLocaleString()}
        - Asset-Based: $${results.assetBased.toLocaleString()}
        - Estimated Range: ${results.valuationRange}
        
        Please provide a concise analysis (150-200 words) covering:
        1. Key strengths and weaknesses
        2. Valuation methodology insights
        3. Industry-specific considerations
        4. Growth prospects and risks
        
        Focus on actionable insights for decision-making.
      `;

      try {
        const aiAnalysis = await callAzureOpenAI(aiPrompt);
        results.aiAnalysis = aiAnalysis;
      } catch (aiError) {
        console.error("AI analysis failed:", aiError);
        results.aiAnalysis = "AI analysis temporarily unavailable. The valuation results are based on industry-standard methodologies and comparable company analysis.";
      }

      // Store valuation in memory
      const valuation = await storage.createValuation(validatedData);
      
      // Update with results
      await (storage as any).updateValuation(valuation.id, {
        aiAnalysis: results.aiAnalysis,
        valuationRange: results.valuationRange,
        confidence: results.confidence,
        dcfValue: results.dcf,
        compsValue: results.comps,
        assetBasedValue: results.assetBased,
        riskAssessment: results.riskAssessment,
      });

      res.json({
        success: true,
        valuationId: valuation.id,
        results,
      });
    } catch (error) {
      console.error("Valuation error:", error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Valuation analysis failed",
      });
    }
  });

  // Quick calculator endpoint
  app.post("/api/quick-calculator", async (req, res) => {
    try {
      const { revenue, ebitda, industry } = req.body;
      
      if (!revenue || !ebitda) {
        return res.status(400).json({ error: "Revenue and EBITDA are required" });
      }

      // Industry multiples
      const industryMultiples = {
        'Technology': { revenue: 4.2, ebitda: 15.5 },
        'Healthcare': { revenue: 3.8, ebitda: 12.3 },
        'Financial Services': { revenue: 2.9, ebitda: 11.2 },
        'Manufacturing': { revenue: 1.8, ebitda: 8.5 },
        'Retail': { revenue: 1.4, ebitda: 7.8 },
        'Other': { revenue: 2.5, ebitda: 10.0 }
      };

      const multiples = industryMultiples[industry as keyof typeof industryMultiples] || industryMultiples.Other;
      
      const revenueEstimate = revenue * multiples.revenue;
      const ebitdaEstimate = ebitda * multiples.ebitda;
      
      const lowEstimate = Math.min(revenueEstimate, ebitdaEstimate) * 0.9;
      const highEstimate = Math.max(revenueEstimate, ebitdaEstimate) * 1.1;

      res.json({
        revenueMultiple: `${multiples.revenue}x`,
        ebitdaMultiple: `${multiples.ebitda}x`,
        quickEstimate: `$${(lowEstimate / 1000000).toFixed(1)}M - $${(highEstimate / 1000000).toFixed(1)}M`,
      });
    } catch (error) {
      res.status(500).json({ error: "Calculator error" });
    }
  });

  // Get valuation by ID
  app.get("/api/valuations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const valuation = await storage.getValuation(id);
      
      if (!valuation) {
        return res.status(404).json({ error: "Valuation not found" });
      }

      res.json(valuation);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve valuation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
