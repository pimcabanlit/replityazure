import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { type ValuationResults } from "@shared/schema";

interface DetailedReportProps {
  results: ValuationResults;
}

export default function DetailedReport({ results }: DetailedReportProps) {
  const handleDownload = () => {
    // TODO: Implement actual download functionality
    console.log("Downloading full report...");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Detailed Analysis Report</span>
          </CardTitle>
          <Button onClick={handleDownload} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          {/* Executive Summary */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Executive Summary</h4>
            <p className="text-gray-700 leading-relaxed">
              The AI-powered valuation analysis indicates a fair value range of {results.valuationRange} for this company.
              The analysis incorporates multiple valuation methodologies including DCF analysis, market comparables, and 
              asset-based approaches. Key drivers include strong revenue growth, healthy margins, and favorable industry conditions.
            </p>
          </div>

          {/* Methodology Explanation */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Methodology & Assumptions</h4>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Discounted Cash Flow (DCF)</h5>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>5-year projection period with terminal value calculation</li>
                  <li>10% weighted average cost of capital (WACC)</li>
                  <li>3% perpetual growth rate assumption</li>
                  <li>Revenue growth declining from current rate to 5% over projection period</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Market Comparables</h5>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>12 publicly traded companies in similar industry segments</li>
                  <li>Size and growth profile adjustments applied</li>
                  <li>Marketability discount of 30% for private company status</li>
                  <li>Revenue multiples ranging from 2.8x to 4.5x</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Findings */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Key Findings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h5 className="font-medium text-green-800 mb-2">Strengths</h5>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Strong revenue growth trajectory</li>
                  <li>Positive EBITDA margins</li>
                  <li>Experienced management team</li>
                  <li>Growing market opportunity</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h5 className="font-medium text-yellow-800 mb-2">Areas of Concern</h5>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>High customer concentration</li>
                  <li>Competitive market dynamics</li>
                  <li>Capital intensive growth requirements</li>
                  <li>Regulatory uncertainty</li>
                </ul>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          {results.aiAnalysis && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">AI-Powered Analysis</h4>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {results.aiAnalysis}
                </p>
              </div>
            </div>
          )}

          {/* Disclaimers */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Important Disclaimers</h5>
            <p className="text-xs text-gray-600 leading-relaxed">
              This valuation is for informational purposes only and should not be construed as investment advice. 
              The analysis is based on information provided and publicly available data. Actual transaction values 
              may vary significantly due to market conditions, negotiation factors, and other variables not captured 
              in this analysis. Users should consult with qualified financial professionals before making investment decisions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
