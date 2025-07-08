import { valuations, type Valuation, type InsertValuation } from "@shared/schema";

export interface IStorage {
  createValuation(valuation: InsertValuation): Promise<Valuation>;
  getValuation(id: number): Promise<Valuation | undefined>;
  getRecentValuations(limit?: number): Promise<Valuation[]>;
}

export class MemStorage implements IStorage {
  private valuations: Map<number, Valuation>;
  private currentId: number;

  constructor() {
    this.valuations = new Map();
    this.currentId = 1;
  }

  async createValuation(insertValuation: InsertValuation): Promise<Valuation> {
    const id = this.currentId++;
    const valuation: Valuation = {
      id,
      companyName: insertValuation.companyName,
      industry: insertValuation.industry,
      companyStage: insertValuation.companyStage,
      revenue: insertValuation.revenue,
      ebitda: insertValuation.ebitda,
      growthRate: insertValuation.growthRate,
      employees: insertValuation.employees,
      selectedMethods: insertValuation.selectedMethods as string[],
      aiAnalysis: null,
      valuationRange: null,
      confidence: null,
      dcfValue: null,
      compsValue: null,
      assetBasedValue: null,
      riskAssessment: null,
      createdAt: new Date(),
    };
    this.valuations.set(id, valuation);
    return valuation;
  }

  async getValuation(id: number): Promise<Valuation | undefined> {
    return this.valuations.get(id);
  }

  async getRecentValuations(limit: number = 10): Promise<Valuation[]> {
    return Array.from(this.valuations.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async updateValuation(id: number, updates: Partial<Valuation>): Promise<Valuation | undefined> {
    const existing = this.valuations.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.valuations.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
