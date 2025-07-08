import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertValuationSchema, type InsertValuation, type ValuationResults } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, Loader2, BarChart3 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CompanyFormProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (results: ValuationResults) => void;
  onAnalysisError: (error: string) => void;
  isAnalyzing: boolean;
}

const COMPANY_STAGES = [
  { value: "Startup", label: "Startup" },
  { value: "Growth", label: "Growth" },
  { value: "Mature", label: "Mature" },
  { value: "Public", label: "Public" },
];

const INDUSTRIES = [
  { value: "Technology", label: "Technology" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Financial Services", label: "Financial Services" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Retail", label: "Retail" },
  { value: "Other", label: "Other" },
];

export default function CompanyForm({ onAnalysisStart, onAnalysisComplete, onAnalysisError, isAnalyzing }: CompanyFormProps) {
  const [selectedStage, setSelectedStage] = useState("Growth");
  const [selectedMethods, setSelectedMethods] = useState({
    dcf: true,
    comparables: true,
    precedent: false,
    assetBased: true,
  });
  const { toast } = useToast();

  const form = useForm<InsertValuation>({
    resolver: zodResolver(insertValuationSchema),
    defaultValues: {
      companyName: "",
      industry: "Technology",
      companyStage: "Growth",
      revenue: 0,
      ebitda: 0,
      growthRate: 0,
      employees: 0,
      selectedMethods: ["dcf", "comparables", "assetBased"],
    },
  });

  const valuationMutation = useMutation({
    mutationFn: async (data: InsertValuation) => {
      const response = await apiRequest("POST", "/api/valuations", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        onAnalysisComplete(data.results);
        toast({
          title: "Analysis Complete",
          description: "Your valuation analysis has been generated successfully.",
        });
      } else {
        onAnalysisError(data.error || "Analysis failed");
        toast({
          title: "Analysis Failed",
          description: data.error || "Please check your input and try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      onAnalysisError(error.message);
      toast({
        title: "Analysis Failed",
        description: "Please check your input and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertValuation) => {
    const methods = Object.entries(selectedMethods)
      .filter(([_, selected]) => selected)
      .map(([method, _]) => method);
    
    if (methods.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one valuation method.",
        variant: "destructive",
      });
      return;
    }

    const submissionData = {
      ...data,
      companyStage: selectedStage,
      selectedMethods: methods,
    };

    onAnalysisStart();
    valuationMutation.mutate(submissionData);
  };

  const handleMethodChange = (method: string, checked: boolean) => {
    setSelectedMethods(prev => ({
      ...prev,
      [method]: checked,
    }));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Company Details */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="companyName">Company Name*</Label>
          <Input
            id="companyName"
            {...form.register("companyName")}
            placeholder="Enter company name"
            className="mt-2"
          />
          {form.formState.errors.companyName && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.companyName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="industry">Industry</Label>
          <Select
            value={form.watch("industry")}
            onValueChange={(value) => form.setValue("industry", value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry.value} value={industry.value}>
                  {industry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Company Stage</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {COMPANY_STAGES.map((stage) => (
              <Button
                key={stage.value}
                type="button"
                variant={selectedStage === stage.value ? "default" : "outline"}
                className="text-sm"
                onClick={() => setSelectedStage(stage.value)}
              >
                {stage.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Data */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="text-md font-medium text-gray-900">Financial Metrics</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="revenue">Revenue ($)</Label>
              <Input
                id="revenue"
                type="number"
                {...form.register("revenue", { valueAsNumber: true })}
                placeholder="1,000,000"
                className="mt-1"
              />
              {form.formState.errors.revenue && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.revenue.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="ebitda">EBITDA ($)</Label>
              <Input
                id="ebitda"
                type="number"
                {...form.register("ebitda", { valueAsNumber: true })}
                placeholder="200,000"
                className="mt-1"
              />
              {form.formState.errors.ebitda && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.ebitda.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="growthRate">Growth Rate (%)</Label>
              <Input
                id="growthRate"
                type="number"
                {...form.register("growthRate", { valueAsNumber: true })}
                placeholder="15"
                className="mt-1"
              />
              {form.formState.errors.growthRate && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.growthRate.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="employees">Employees</Label>
              <Input
                id="employees"
                type="number"
                {...form.register("employees", { valueAsNumber: true })}
                placeholder="50"
                className="mt-1"
              />
              {form.formState.errors.employees && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.employees.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Valuation Methods */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">Valuation Methods</h3>
        <div className="space-y-3">
          {[
            { key: "dcf", label: "DCF Analysis" },
            { key: "comparables", label: "Comparable Companies" },
            { key: "precedent", label: "Precedent Transactions" },
            { key: "assetBased", label: "Asset-Based Approach" },
          ].map((method) => (
            <div key={method.key} className="flex items-center space-x-2">
              <Checkbox
                id={method.key}
                checked={selectedMethods[method.key as keyof typeof selectedMethods]}
                onCheckedChange={(checked) => handleMethodChange(method.key, checked as boolean)}
              />
              <Label htmlFor={method.key} className="text-sm text-gray-700">
                {method.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            AI is analyzing your data...
          </>
        ) : (
          <>
            <Calculator className="mr-2 h-4 w-4" />
            Generate AI Valuation
          </>
        )}
      </Button>
    </form>
  );
}
