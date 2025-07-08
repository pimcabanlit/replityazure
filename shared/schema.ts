import { pgTable, text, serial, integer, real, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const valuations = pgTable("valuations", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  industry: text("industry").notNull(),
  companyStage: text("company_stage").notNull(),
  revenue: real("revenue").notNull(),
  ebitda: real("ebitda").notNull(),
  growthRate: real("growth_rate").notNull(),
  employees: integer("employees").notNull(),
  selectedMethods: json("selected_methods").$type<string[]>().notNull(),
  aiAnalysis: text("ai_analysis"),
  valuationRange: text("valuation_range"),
  confidence: real("confidence"),
  dcfValue: real("dcf_value"),
  compsValue: real("comps_value"),
  assetBasedValue: real("asset_based_value"),
  riskAssessment: json("risk_assessment").$type<{
    marketRisk: number;
    financialRisk: number;
    operationalRisk: number;
    liquidityRisk: number;
    overallScore: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertValuationSchema = createInsertSchema(valuations).omit({
  id: true,
  createdAt: true,
  aiAnalysis: true,
  valuationRange: true,
  confidence: true,
  dcfValue: true,
  compsValue: true,
  assetBasedValue: true,
  riskAssessment: true,
});

export const valuationMethodsSchema = z.object({
  dcf: z.boolean().default(true),
  comparables: z.boolean().default(true),
  precedent: z.boolean().default(false),
  assetBased: z.boolean().default(true),
});

export type InsertValuation = z.infer<typeof insertValuationSchema>;
export type Valuation = typeof valuations.$inferSelect;
export type ValuationMethods = z.infer<typeof valuationMethodsSchema>;

export interface QuickCalculatorData {
  revenueMultiple: number;
  ebitdaMultiple: number;
  quickEstimate: string;
}

export interface ValuationResults {
  valuationRange: string;
  confidence: number;
  dcf: number;
  comps: number;
  assetBased: number;
  aiAnalysis: string;
  riskAssessment: {
    marketRisk: number;
    financialRisk: number;
    operationalRisk: number;
    liquidityRisk: number;
    overallScore: number;
  };
  keyMetrics: {
    revenueMultiple: number;
    ebitdaMultiple: number;
    enterpriseValue: number;
    peRatio: number;
    pegRatio: number;
    priceToBook: number;
  };
}
