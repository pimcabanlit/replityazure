import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, FileText, Download, Share, CheckCircle, Bot } from "lucide-react";
import { type ValuationResults } from "@shared/schema";
import RiskAssessment from "./risk-assessment";
import DetailedReport from "./detailed-report";

interface ValuationResultsProps {
  results: ValuationResults;
}

export default function ValuationResults({ results }: ValuationResultsProps) {
  const handleExport = (format: string) => {
    // TODO: Implement actual export functionality
    console.log(`Exporting report in ${format} format`);
  };

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-primary" />
              <CardTitle>Valuation Results</CardTitle>
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                AI Generated
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExport("pdf")}
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExport("excel")}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExport("share")}
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Main Valuation Range */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 p-6 rounded-xl mb-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Estimated Company Valuation</div>
              <div className="text-3xl font-bold text-primary mb-2">{results.valuationRange}</div>
              <div className="text-sm text-gray-600">
                Confidence Level: <span className="font-medium text-accent">{results.confidence}%</span>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${results.confidence}%` }}
                />
              </div>
            </div>
          </div>

          {/* Methodology Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">DCF Analysis</span>
                <CheckCircle className="h-4 w-4 text-accent" />
              </div>
              <div className="text-xl font-bold text-gray-900">
                ${(results.dcf / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-500">10% discount rate</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Market Comps</span>
                <CheckCircle className="h-4 w-4 text-accent" />
              </div>
              <div className="text-xl font-bold text-gray-900">
                ${(results.comps / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-500">12 comparable companies</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Asset-Based</span>
                <CheckCircle className="h-4 w-4 text-accent" />
              </div>
              <div className="text-xl font-bold text-gray-900">
                ${(results.assetBased / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-500">Adjusted book value</div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">AI Analysis Summary</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {results.aiAnalysis || "Analysis in progress..."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-4 w-4 text-primary" />
              <span>Key Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Revenue Multiple", value: `${results.keyMetrics.revenueMultiple}x` },
                { label: "EBITDA Multiple", value: `${results.keyMetrics.ebitdaMultiple}x` },
                { label: "Enterprise Value", value: `$${(results.keyMetrics.enterpriseValue / 1000000).toFixed(1)}M` },
                { label: "P/E Ratio", value: `${results.keyMetrics.peRatio}x` },
                { label: "PEG Ratio", value: `${results.keyMetrics.pegRatio}` },
                { label: "Price/Book", value: `${results.keyMetrics.priceToBook}x` },
              ].map((metric, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-600">{metric.label}</span>
                  <span className="font-semibold">{metric.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <RiskAssessment riskData={results.riskAssessment} />
      </div>

      {/* Detailed Report */}
      <DetailedReport results={results} />
    </div>
  );
}
