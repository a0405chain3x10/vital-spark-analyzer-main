import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts";

interface RiskTrendData {
  timestamp: string;
  overallRisk: number;
  cardiovascularRisk: number;
  respiratoryRisk: number;
  neurologicalRisk: number;
  infectionRisk: number;
}

interface RiskTrendChartProps {
  data: RiskTrendData[];
}

const chartConfig = {
  overallRisk: {
    label: "Overall Risk",
    color: "hsl(var(--chart-hr))"
  },
  cardiovascularRisk: {
    label: "Cardiovascular",
    color: "hsl(var(--chart-spo2))"
  },
  respiratoryRisk: {
    label: "Respiratory",
    color: "hsl(var(--chart-hrv))"
  },
  neurologicalRisk: {
    label: "Neurological",
    color: "hsl(var(--chart-correlation))"
  },
  infectionRisk: {
    label: "Infection",
    color: "hsl(var(--risk-critical))"
  }
};

export const RiskTrendChart = ({ data }: RiskTrendChartProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Risk Assessment Trends</CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time risk scoring across multiple physiological systems (last 4 hours)
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
            <XAxis 
              dataKey="timestamp" 
              className="text-xs" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            />
            <YAxis 
              className="text-xs" 
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="overallRisk" 
              stroke="var(--color-overallRisk)" 
              strokeWidth={3}
              dot={{ fill: "var(--color-overallRisk)", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="cardiovascularRisk" 
              stroke="var(--color-cardiovascularRisk)" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="respiratoryRisk" 
              stroke="var(--color-respiratoryRisk)" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="neurologicalRisk" 
              stroke="var(--color-neurologicalRisk)" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="infectionRisk" 
              stroke="var(--color-infectionRisk)" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};