import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskAssessmentCard } from "./risk-analysis/RiskAssessmentCard";
import { DetailedMetricsPanel } from "./risk-analysis/DetailedMetricsPanel";
import { RiskTrendChart } from "./risk-analysis/RiskTrendChart";
import { ClinicalAlerts } from "./risk-analysis/ClinicalAlerts";
import { RealtimeVitalSigns } from "./monitoring/RealtimeVitalSigns";
import { HRVAnalysis } from "./monitoring/HRVAnalysis";
import { Heart, Stethoscope, Brain, Shield, Activity, AlertTriangle, Droplets } from "lucide-react";

interface ClinicalAlert {
  id: string;
  severity: "info" | "warning" | "critical" | "resolved";
  title: string;
  description: string;
  timestamp: string;
  duration?: string;
  category: "cardiovascular" | "respiratory" | "neurological" | "infection" | "general";
  actionRequired: boolean;
  acknowledgedBy?: string;
  recommendations: string[];
}

interface DashboardData {
  riskTrendData: Array<{
    timestamp: string;
    overallRisk: number;
    cardiovascularRisk: number;
    respiratoryRisk: number;
    neurologicalRisk: number;
    infectionRisk: number;
  }>;
  cardiovascularFactors: Array<{
    name: string;
    value: number;
    status: "low" | "moderate" | "high" | "critical";
    trend: "stable" | "improving" | "deteriorating";
    details: string;
  }>;
  respiratoryFactors: Array<{
    name: string;
    value: number;
    status: "low" | "moderate" | "high" | "critical";
    trend: "stable" | "improving" | "deteriorating";
    details: string;
  }>;
  infectionFactors: Array<{
    name: string;
    value: number;
    status: "low" | "moderate" | "high" | "critical";
    trend: "stable" | "improving" | "deteriorating";
    details: string;
  }>;
  detailedMetrics: Array<{
    label: string;
    value: string;
    unit: string;
    normalRange: string;
    status: "normal" | "warning" | "critical" | "optimal";
    trend: number;
    lastUpdate: string;
    details: {
      mean: string;
      stdDev: string;
      coefficient: string;
    };
  }>;
  clinicalAlerts: ClinicalAlert[];
  realtimeVitals: Array<{
    label: string;
    value: number;
    unit: string;
    normalRange: string;
    status: "normal" | "warning" | "critical" | "optimal";
    icon: React.ReactNode;
    color: string;
    lastUpdate: string;
  }>;
  chartData: Array<{
    timestamp: string;
    heartRate: number;
    spo2: number;
    respiratoryRate: number;
  }>;
  hrvData: Array<{
    timestamp: string;
    rmssd: number;
    sdnn: number;
    pnn50: number;
    frequency: number;
  }>;
  currentHRV: {
    rmssd: number;
    sdnn: number;
    pnn50: number;
    trend: "up" | "down" | "stable";
    interpretation: string;
  };
}

// Mock data - in real app this would come from medical device APIs
const generateMockData = (): DashboardData => {
  const now = new Date();
  const riskTrendData = Array.from({ length: 24 }, (_, i) => {
    const timestamp = new Date(now.getTime() - (23 - i) * 10 * 60 * 1000).toISOString();
    return {
      timestamp,
      overallRisk: 15 + Math.random() * 20 + Math.sin(i * 0.2) * 10,
      cardiovascularRisk: 10 + Math.random() * 15 + Math.sin(i * 0.3) * 8,
      respiratoryRisk: 8 + Math.random() * 12 + Math.cos(i * 0.25) * 6,
      neurologicalRisk: 5 + Math.random() * 10 + Math.sin(i * 0.4) * 5,
      infectionRisk: 3 + Math.random() * 8 + Math.cos(i * 0.15) * 4,
    };
  });

  const cardiovascularFactors = [
    {
      name: "Heart Rate Variability",
      value: 23,
      status: "moderate" as const,
      trend: "stable" as const,
      details: "RMSSD below normal range, indicating autonomic dysfunction"
    },
    {
      name: "HR-SpO₂ Correlation",
      value: 45,
      status: "high" as const,
      trend: "deteriorating" as const,
      details: "Strong negative correlation suggests cardiorespiratory coupling issues"
    },
    {
      name: "Bradycardia Episodes",
      value: 18,
      status: "low" as const,
      trend: "improving" as const,
      details: "Frequency decreased from 3.2 to 2.1 episodes/hour"
    }
  ];

  const respiratoryFactors = [
    {
      name: "Apnea Events",
      value: 67,
      status: "critical" as const,
      trend: "deteriorating" as const,
      details: "Central apnea events >20s duration increased by 40%"
    },
    {
      name: "SpO₂ Desaturation",
      value: 34,
      status: "moderate" as const,
      trend: "stable" as const,
      details: "Intermittent drops below 85%, recovery time normal"
    },
    {
      name: "Breathing Pattern",
      value: 12,
      status: "low" as const,
      trend: "improving" as const,
      details: "Periodic breathing episodes reduced significantly"
    }
  ];

  const infectionFactors = [
    {
      name: "HRV Complexity",
      value: 29,
      status: "moderate" as const,
      trend: "stable" as const,
      details: "Reduced complexity may indicate early sepsis"
    },
    {
      name: "Temperature Variability",
      value: 15,
      status: "low" as const,
      trend: "improving" as const,
      details: "Stable thermal regulation, no concerning patterns"
    },
    {
      name: "Perfusion Index",
      value: 42,
      status: "high" as const,
      trend: "deteriorating" as const,
      details: "Peripheral perfusion showing concerning trends"
    }
  ];

  const detailedMetrics = [
    {
      label: "Heart Rate",
      value: "142",
      unit: "BPM",
      normalRange: "120-160 BPM",
      status: "normal" as const,
      trend: -2.3,
      lastUpdate: "12s ago",
      details: {
        mean: "144.2",
        stdDev: "8.7",
        coefficient: "6.1%"
      }
    },
    {
      label: "SpO₂ Saturation",
      value: "97",
      unit: "%",
      normalRange: "95-100%",
      status: "normal" as const,
      trend: 1.2,
      lastUpdate: "8s ago",
      details: {
        mean: "97.8",
        stdDev: "1.4",
        coefficient: "1.4%"
      }
    },
    {
      label: "RMSSD (HRV)",
      value: "12.4",
      unit: "ms",
      normalRange: "15-40 ms",
      status: "warning" as const,
      trend: -8.1,
      lastUpdate: "15s ago",
      details: {
        mean: "13.2",
        stdDev: "2.8",
        coefficient: "21.2%"
      }
    }
  ];

  const clinicalAlerts: ClinicalAlert[] = [
    {
      id: "alert-001",
      severity: "critical",
      title: "Prolonged Apnea Event",
      description: "Central apnea lasting 28 seconds detected with bradycardia and desaturation",
      timestamp: "2 min ago",
      duration: "28s",
      category: "respiratory",
      actionRequired: true,
      recommendations: [
        "Immediate assessment of airway patency",
        "Consider increasing CPAP pressure",
        "Monitor for additional episodes",
        "Notify attending physician if pattern continues"
      ]
    },
    {
      id: "alert-002",
      severity: "warning",
      title: "HRV Complexity Decline",
      description: "Heart rate variability complexity index has decreased by 25% over the last 2 hours",
      timestamp: "15 min ago",
      category: "cardiovascular",
      actionRequired: true,
      recommendations: [
        "Review recent interventions or medication changes",
        "Consider blood culture if other signs of infection",
        "Monitor trend closely over next 4 hours"
      ]
    },
    {
      id: "alert-003",
      severity: "info",
      title: "Feeding Tolerance",
      description: "Stable vital signs during recent feeding, no bradycardia events noted",
      timestamp: "45 min ago",
      category: "general",
      actionRequired: false,
      acknowledgedBy: "Dr. Smith",
      recommendations: [
        "Continue current feeding protocol",
        "Monitor for delayed responses"
      ]
    }
  ];

  // Generate real-time vital signs data
  const realtimeVitals = [
    {
      label: "Heart Rate",
      value: 142,
      unit: "BPM",
      normalRange: "120-160 BPM",
      status: "normal" as const,
      icon: <Heart className="h-4 w-4" />,
      color: "hsl(var(--chart-hr))",
      lastUpdate: `${Math.floor(Math.random() * 30)} seconds ago`
    },
    {
      label: "SpO₂ Saturation", 
      value: 97,
      unit: "%",
      normalRange: "95-100%",
      status: "normal" as const,
      icon: <Droplets className="h-4 w-4" />,
      color: "hsl(var(--chart-spo2))",
      lastUpdate: `${Math.floor(Math.random() * 30)} seconds ago`
    },
    {
      label: "Respiratory Rate",
      value: 34,
      unit: "/min",
      normalRange: "30-40 /min",
      status: "normal" as const,
      icon: <Activity className="h-4 w-4" />,
      color: "hsl(var(--chart-hrv))",
      lastUpdate: `${Math.floor(Math.random() * 30)} seconds ago`
    }
  ];

  // Generate chart data for last 10 minutes
  const chartData = Array.from({ length: 20 }, (_, i) => {
    const timestamp = new Date(now.getTime() - (19 - i) * 30 * 1000).toISOString();
    return {
      timestamp,
      heartRate: 140 + Math.random() * 20 + Math.sin(i * 0.3) * 10,
      spo2: 96 + Math.random() * 4,
      respiratoryRate: 32 + Math.random() * 8 + Math.cos(i * 0.2) * 4,
    };
  });

  // Generate HRV data
  const hrvData = Array.from({ length: 15 }, (_, i) => {
    const timestamp = new Date(now.getTime() - (14 - i) * 60 * 1000).toISOString();
    return {
      timestamp,
      rmssd: 12 + Math.random() * 8 + Math.sin(i * 0.4) * 3,
      sdnn: 25 + Math.random() * 15 + Math.cos(i * 0.3) * 5,
      pnn50: 8 + Math.random() * 6 + Math.sin(i * 0.5) * 2,
      frequency: 0.1 + Math.random() * 0.3,
    };
  });

  const currentHRV = {
    rmssd: 12.4,
    sdnn: 28.7,
    pnn50: 9.2,
    trend: "down" as const,
    interpretation: "Current HRV metrics indicate reduced autonomic function. The declining RMSSD suggests decreased parasympathetic activity, which may be associated with physiological stress or early pathological changes. Continue monitoring closely."
  };

  return {
    riskTrendData,
    cardiovascularFactors,
    respiratoryFactors,
    infectionFactors,
    detailedMetrics,
    clinicalAlerts,
    realtimeVitals,
    chartData,
    hrvData,
    currentHRV
  };
};

export const RiskAnalysisDashboard = () => {
  const [data, setData] = useState(generateMockData());
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateMockData());
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAcknowledgeAlert = (id: string) => {
    setData(prev => ({
      ...prev,
      clinicalAlerts: prev.clinicalAlerts.map(alert =>
        alert.id === id ? { ...alert, acknowledgedBy: "Dr. Johnson" } : alert
      )
    }));
  };

  const handleDismissAlert = (id: string) => {
    setData(prev => ({
      ...prev,
      clinicalAlerts: prev.clinicalAlerts.filter(alert => alert.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Neonatal Risk Analysis Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Advanced physiological monitoring and risk assessment system
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last updated</p>
            <p className="font-medium">{lastUpdate.toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Current Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Risk</p>
                  <p className="text-2xl font-bold text-primary">24%</p>
                </div>
                <Badge className="bg-vital-warning/10 text-vital-warning">
                  MODERATE
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold text-primary">
                    {data.clinicalAlerts.filter(a => a.severity === "critical" || a.severity === "warning").length}
                  </p>
                </div>
                <AlertTriangle className="h-5 w-5 text-vital-warning" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Events</p>
                  <p className="text-2xl font-bold text-primary">
                    {data.clinicalAlerts.filter(a => a.severity === "critical").length}
                  </p>
                </div>
                <Badge variant="destructive">URGENT</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monitoring</p>
                  <p className="text-2xl font-bold text-vital-optimal">ACTIVE</p>
                </div>
                <Activity className="h-5 w-5 text-vital-optimal" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
            <TabsTrigger value="overview">Risk Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Metrics</TabsTrigger>
            <TabsTrigger value="hrv">HRV Analysis</TabsTrigger>
            <TabsTrigger value="alerts">Clinical Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-6">
            <RealtimeVitalSigns 
              vitals={data.realtimeVitals} 
              chartData={data.chartData}
            />
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RiskAssessmentCard
                title="Cardiovascular Risk"
                overallRisk={28}
                riskLevel="moderate"
                factors={data.cardiovascularFactors}
                icon={<Heart className="h-5 w-5" />}
              />
              <RiskAssessmentCard
                title="Respiratory Risk"
                overallRisk={45}
                riskLevel="high"
                factors={data.respiratoryFactors}
                icon={<Stethoscope className="h-5 w-5" />}
              />
              <RiskAssessmentCard
                title="Infection Risk"
                overallRisk={18}
                riskLevel="low"
                factors={data.infectionFactors}
                icon={<Shield className="h-5 w-5" />}
              />
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DetailedMetricsPanel
                title="Primary Vital Signs"
                metrics={data.detailedMetrics}
              />
              <Card>
                <CardHeader>
                  <CardTitle>Physiological Correlations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-card border">
                      <p className="text-sm text-muted-foreground">HR-SpO₂ Correlation</p>
                      <p className="text-2xl font-bold text-chart-correlation">-0.34</p>
                      <p className="text-xs text-muted-foreground">Moderate negative correlation</p>
                    </div>
                    <div className="p-4 rounded-lg bg-card border">
                      <p className="text-sm text-muted-foreground">HRV-RR Coupling</p>
                      <p className="text-2xl font-bold text-chart-hrv">0.67</p>
                      <p className="text-xs text-muted-foreground">Strong positive coupling</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Clinical Interpretation</h4>
                    <p className="text-sm text-muted-foreground">
                      The moderate negative correlation between heart rate and oxygen saturation, 
                      combined with reduced HRV complexity, suggests developing cardiorespiratory 
                      instability that requires close monitoring.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hrv" className="space-y-6">
            <HRVAnalysis 
              data={data.hrvData}
              currentValues={data.currentHRV}
            />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <RiskTrendChart data={data.riskTrendData} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <ClinicalAlerts
              alerts={data.clinicalAlerts}
              onAcknowledge={handleAcknowledgeAlert}
              onDismiss={handleDismissAlert}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};