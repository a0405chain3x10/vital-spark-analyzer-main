import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricData {
  label: string;
  value: string;
  unit: string;
  normalRange: string;
  status: "normal" | "warning" | "critical" | "optimal";
  trend: number; // percentage change
  lastUpdate: string;
  details: {
    mean: string;
    stdDev: string;
    coefficient: string;
  };
}

interface DetailedMetricsPanelProps {
  title: string;
  metrics: MetricData[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "optimal": return "text-vital-optimal bg-vital-optimal/10 border-vital-optimal/20";
    case "normal": return "text-vital-normal bg-vital-normal/10 border-vital-normal/20";
    case "warning": return "text-vital-warning bg-vital-warning/10 border-vital-warning/20";
    case "critical": return "text-vital-critical bg-vital-critical/10 border-vital-critical/20";
    default: return "text-muted-foreground";
  }
};

const getTrendIcon = (trend: number) => {
  if (trend > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
  if (trend < 0) return <TrendingDown className="h-3 w-3 text-red-500" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
};

export const DetailedMetricsPanel = ({ title, metrics }: DetailedMetricsPanelProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="space-y-3 p-4 rounded-lg bg-card border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{metric.label}</h4>
                  <p className="text-xs text-muted-foreground">Range: {metric.normalRange}</p>
                </div>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {metric.value}
                    <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(metric.trend)}
                    <span className="text-xs text-muted-foreground">
                      {metric.trend > 0 ? '+' : ''}{metric.trend}% vs prev hour
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Last update</p>
                  <p className="text-sm font-medium">{metric.lastUpdate}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Mean (1h)</p>
                  <p className="font-medium">{metric.details.mean}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Std Dev</p>
                  <p className="font-medium">{metric.details.stdDev}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">CV</p>
                  <p className="font-medium">{metric.details.coefficient}</p>
                </div>
              </div>
            </div>
            {index < metrics.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};