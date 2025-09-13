import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Heart, Droplets, Activity } from "lucide-react";

interface VitalSign {
  label: string;
  value: number;
  unit: string;
  normalRange: string;
  status: "normal" | "warning" | "critical" | "optimal";
  icon: React.ReactNode;
  color: string;
  lastUpdate: string;
}

interface RealtimeVitalSignsProps {
  vitals: VitalSign[];
  chartData: Array<{
    timestamp: string;
    heartRate: number;
    spo2: number;
    respiratoryRate: number;
  }>;
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

const chartConfig = {
  heartRate: {
    label: "Heart Rate",
    color: "hsl(var(--chart-hr))"
  },
  spo2: {
    label: "SpO₂",
    color: "hsl(var(--chart-spo2))"
  },
  respiratoryRate: {
    label: "Respiratory Rate",
    color: "hsl(var(--chart-hrv))"
  }
};

export const RealtimeVitalSigns = ({ vitals, chartData }: RealtimeVitalSignsProps) => {
  return (
    <div className="space-y-6">
      {/* Live Vital Signs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vitals.map((vital, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-primary/20 to-primary/5" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-primary/10 text-primary`}>
                    {vital.icon}
                  </div>
                  <h3 className="font-medium">{vital.label}</h3>
                </div>
                <Badge className={getStatusColor(vital.status)}>
                  {vital.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold" style={{ color: vital.color }}>
                  {vital.value}
                </span>
                <span className="text-sm text-muted-foreground">{vital.unit}</span>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">LIVE</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Normal: {vital.normalRange}</p>
                <p>Updated: {vital.lastUpdate}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-chart-hr" />
              Heart Rate Monitor
            </CardTitle>
            <p className="text-sm text-muted-foreground">Real-time heart rate (last 10 minutes)</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
                <XAxis 
                  dataKey="timestamp" 
                  className="text-xs" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                />
                <YAxis 
                  className="text-xs" 
                  domain={[100, 180]}
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="var(--color-heartRate)" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "var(--color-heartRate)" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* SpO2 Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-chart-spo2" />
              Oxygen Saturation
            </CardTitle>
            <p className="text-sm text-muted-foreground">Real-time SpO₂ levels (last 10 minutes)</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
                <XAxis 
                  dataKey="timestamp" 
                  className="text-xs" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                />
                <YAxis 
                  className="text-xs" 
                  domain={[90, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="spo2" 
                  stroke="var(--color-spo2)" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "var(--color-spo2)" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Combined Vital Signs Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Combined Vital Signs Monitoring
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Multi-parameter real-time monitoring with normalized scales
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={chartData}>
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
              <Line 
                type="monotone" 
                dataKey="heartRate" 
                stroke="var(--color-heartRate)" 
                strokeWidth={2}
                dot={false}
                name="Heart Rate (BPM)"
              />
              <Line 
                type="monotone" 
                dataKey="spo2" 
                stroke="var(--color-spo2)" 
                strokeWidth={2}
                dot={false}
                name="SpO₂ (%)"
              />
              <Line 
                type="monotone" 
                dataKey="respiratoryRate" 
                stroke="var(--color-respiratoryRate)" 
                strokeWidth={2}
                dot={false}
                name="Respiratory Rate"
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};