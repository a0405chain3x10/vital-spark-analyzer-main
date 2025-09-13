import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Heart, Stethoscope, Activity } from "lucide-react";

interface RiskFactor {
  name: string;
  value: number;
  status: "low" | "moderate" | "high" | "critical";
  trend: "stable" | "improving" | "deteriorating";
  details: string;
}

interface RiskAssessmentCardProps {
  title: string;
  overallRisk: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  factors: RiskFactor[];
  icon?: React.ReactNode;
}

const getRiskColor = (level: string) => {
  switch (level) {
    case "low": return "text-risk-low bg-risk-low/10 border-risk-low/20";
    case "moderate": return "text-risk-moderate bg-risk-moderate/10 border-risk-moderate/20";
    case "high": return "text-risk-high bg-risk-high/10 border-risk-high/20";
    case "critical": return "text-risk-critical bg-risk-critical/10 border-risk-critical/20";
    default: return "text-muted-foreground";
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "improving": return "📈";
    case "deteriorating": return "📉";
    default: return "➡️";
  }
};

export const RiskAssessmentCard = ({ 
  title, 
  overallRisk, 
  riskLevel, 
  factors, 
  icon = <AlertTriangle className="h-5 w-5" />
}: RiskAssessmentCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          {title}
          <Badge className={`ml-auto ${getRiskColor(riskLevel)}`}>
            {riskLevel.toUpperCase()}
          </Badge>
        </CardTitle>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Risk Score</span>
            <span className="font-medium">{overallRisk}%</span>
          </div>
          <Progress value={overallRisk} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {factors.map((factor, index) => (
          <div key={index} className="space-y-2 p-3 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{factor.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs">{getTrendIcon(factor.trend)}</span>
                <Badge variant="outline" className={getRiskColor(factor.status)}>
                  {factor.status}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Score: {factor.value}%</span>
              <Progress value={factor.value} className="h-1 w-20" />
            </div>
            <p className="text-xs text-muted-foreground">{factor.details}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};