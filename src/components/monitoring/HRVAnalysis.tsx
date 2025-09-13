import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

interface HRVData {
  timestamp: string;
  rmssd: number;
  sdnn: number;
  pnn50: number;
  frequency: number;
}

interface HRVAnalysisProps {
  data: HRVData[];
  currentValues: {
    rmssd: number;
    sdnn: number;
    pnn50: number;
    trend: "up" | "down" | "stable";
    interpretation: string;
  };
}

const chartConfig = {
  rmssd: {
    label: "RMSSD",
    color: "hsl(var(--chart-hrv))"
  },
  sdnn: {
    label: "SDNN", 
    color: "hsl(var(--chart-correlation))"
  },
  pnn50: {
    label: "pNN50",
    color: "hsl(var(--chart-hr))"
  }
};

export const HRVAnalysis = ({ data, currentValues }: HRVAnalysisProps) => {
  const getTrendIcon = () => {
    switch (currentValues.trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (currentValues.trend) {
      case "up": return "text-green-500 bg-green-500/10";
      case "down": return "text-red-500 bg-red-500/10";
      default: return "text-muted-foreground bg-muted/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Current HRV Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">RMSSD</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-chart-hrv">
                {currentValues.rmssd.toFixed(1)} ms
              </span>
              <Badge className={getTrendColor()}>
                {getTrendIcon()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Normal: 15-40 ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">SDNN</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-chart-correlation">
                {currentValues.sdnn.toFixed(1)} ms
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Normal: 20-50 ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">pNN50</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-chart-hr">
                {currentValues.pnn50.toFixed(1)}%
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Normal: 5-15%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* HRV Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-chart-hrv" />
            Heart Rate Variability Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time HRV metrics indicating autonomic nervous system function
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
              <XAxis 
                dataKey="timestamp" 
                className="text-xs" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="rmssd"
                stroke="var(--color-rmssd)"
                fill="var(--color-rmssd)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Clinical Interpretation */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <h4 className="font-medium mb-2">Current Assessment</h4>
              <p className="text-sm text-muted-foreground">
                {currentValues.interpretation}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Key Indicators</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• RMSSD reflects parasympathetic activity</li>
                  <li>• SDNN indicates overall autonomic variability</li>
                  <li>• pNN50 measures short-term variability</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Clinical Significance</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Low HRV may indicate stress or illness</li>
                  <li>• Trending changes are more significant than absolute values</li>
                  <li>• Consider alongside other vital signs</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};