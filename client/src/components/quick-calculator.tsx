import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { type QuickCalculatorData } from "@shared/schema";

export default function QuickCalculator() {
  const [revenue, setRevenue] = useState<number>(0);
  const [ebitda, setEbitda] = useState<number>(0);
  const [industry, setIndustry] = useState<string>("Technology");
  const [calculatorData, setCalculatorData] = useState<QuickCalculatorData>({
    revenueMultiple: 0,
    ebitdaMultiple: 0,
    quickEstimate: "$0M - $0M",
  });

  useEffect(() => {
    if (revenue > 0 && ebitda > 0) {
      calculateQuickEstimate();
    }
  }, [revenue, ebitda, industry]);

  const calculateQuickEstimate = async () => {
    try {
      const response = await apiRequest("POST", "/api/quick-calculator", {
        revenue,
        ebitda,
        industry,
      });
      const data = await response.json();
      setCalculatorData(data);
    } catch (error) {
      console.error("Calculator error:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-4 w-4 text-primary" />
          <span>Quick Calculator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="calc-revenue">Revenue ($)</Label>
            <Input
              id="calc-revenue"
              type="number"
              value={revenue || ""}
              onChange={(e) => setRevenue(Number(e.target.value))}
              placeholder="1,000,000"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="calc-ebitda">EBITDA ($)</Label>
            <Input
              id="calc-ebitda"
              type="number"
              value={ebitda || ""}
              onChange={(e) => setEbitda(Number(e.target.value))}
              placeholder="200,000"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="calc-industry">Industry</Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Financial Services">Financial Services</SelectItem>
              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-600">Revenue Multiple</div>
            <div className="font-semibold text-lg">{calculatorData.revenueMultiple}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-600">EBITDA Multiple</div>
            <div className="font-semibold text-lg">{calculatorData.ebitdaMultiple}</div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Quick Estimate</div>
          <div className="text-xl font-bold text-primary">{calculatorData.quickEstimate}</div>
        </div>
      </CardContent>
    </Card>
  );
}
