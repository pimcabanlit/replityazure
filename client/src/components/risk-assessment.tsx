import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield } from "lucide-react";

interface RiskAssessmentProps {
  riskData: {
    marketRisk: number;
    financialRisk: number;
    operationalRisk: number;
    liquidityRisk: number;
    overallScore: number;
  };
}

export default function RiskAssessment({ riskData }: RiskAssessmentProps) {
  const getRiskLevel = (score: number) => {
    if (score <= 30) return { label: "Low", color: "bg-green-500", bgColor: "bg-green-50", textColor: "text-green-700" };
    if (score <= 60) return { label: "Medium", color: "bg-yellow-500", bgColor: "bg-yellow-50", textColor: "text-yellow-700" };
    return { label: "High", color: "bg-red-500", bgColor: "bg-red-50", textColor: "text-red-700" };
  };

  const risks = [
    { name: "Market Risk", score: riskData.marketRisk },
    { name: "Financial Risk", score: riskData.financialRisk },
    { name: "Operational Risk", score: riskData.operationalRisk },
    { name: "Liquidity Risk", score: riskData.liquidityRisk },
  ];

  const overallRisk = getRiskLevel(riskData.overallScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-primary" />
          <span>Risk Assessment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {risks.map((risk, index) => {
          const riskLevel = getRiskLevel(risk.score);
          return (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{risk.name}</span>
                <Badge className={`${riskLevel.bgColor} ${riskLevel.textColor} border-none`}>
                  {riskLevel.label}
                </Badge>
              </div>
              <Progress
                value={risk.score}
                className="h-2"
                style={{
                  '--progress-background': riskLevel.color,
                } as any}
              />
            </div>
          );
        })}

        <div className={`mt-4 p-3 ${overallRisk.bgColor} rounded-lg`}>
          <p className={`text-xs ${overallRisk.textColor}`}>
            <strong>Overall Risk Score:</strong> {overallRisk.label} ({(riskData.overallScore / 20).toFixed(1)}/5.0)
            <br />
            The company shows solid financial health with manageable risk levels across most categories.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
