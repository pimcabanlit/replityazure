import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLine, Building, HelpCircle, UserCircle } from "lucide-react";
import CompanyForm from "@/components/company-form";
import ValuationResults from "@/components/valuation-results";
import QuickCalculator from "@/components/quick-calculator";
import { type ValuationResults as ValuationResultsType } from "@shared/schema";

export default function Home() {
  const [results, setResults] = useState<ValuationResultsType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisComplete = (analysisResults: ValuationResultsType) => {
    setResults(analysisResults);
    setIsAnalyzing(false);
    setError(null);
  };

  const handleAnalysisError = (errorMessage: string) => {
    setError(errorMessage);
    setIsAnalyzing(false);
  };

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <ChartLine className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Valuation Analytics</h1>
                <p className="text-sm text-gray-500">Powered by Azure OpenAI GPT-4o-mini</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <HelpCircle className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <UserCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-primary" />
                  <span>Company Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CompanyForm
                  onAnalysisStart={handleAnalysisStart}
                  onAnalysisComplete={handleAnalysisComplete}
                  onAnalysisError={handleAnalysisError}
                  isAnalyzing={isAnalyzing}
                />
              </CardContent>
            </Card>

            <QuickCalculator />
          </div>

          {/* Right Column - Results Display */}
          <div className="lg:col-span-2">
            {results ? (
              <ValuationResults results={results} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <ChartLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Analysis</h3>
                    <p className="text-gray-500">
                      Complete the company information form to generate an AI-powered valuation analysis.
                    </p>
                    {error && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
