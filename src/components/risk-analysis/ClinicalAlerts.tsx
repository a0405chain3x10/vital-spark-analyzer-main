import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock, User } from "lucide-react";

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

interface ClinicalAlertsProps {
  alerts: ClinicalAlert[];
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical": return <AlertTriangle className="h-4 w-4" />;
    case "warning": return <AlertCircle className="h-4 w-4" />;
    case "info": return <Info className="h-4 w-4" />;
    case "resolved": return <CheckCircle className="h-4 w-4" />;
    default: return <Info className="h-4 w-4" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "text-risk-critical bg-risk-critical/10 border-risk-critical/20";
    case "warning": return "text-risk-moderate bg-risk-moderate/10 border-risk-moderate/20";
    case "info": return "text-primary bg-primary/10 border-primary/20";
    case "resolved": return "text-risk-low bg-risk-low/10 border-risk-low/20";
    default: return "text-muted-foreground";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "cardiovascular": return "bg-chart-hr/10 text-chart-hr";
    case "respiratory": return "bg-chart-spo2/10 text-chart-spo2";
    case "neurological": return "bg-chart-hrv/10 text-chart-hrv";
    case "infection": return "bg-risk-critical/10 text-risk-critical";
    default: return "bg-muted/10 text-muted-foreground";
  }
};

export const ClinicalAlerts = ({ alerts, onAcknowledge, onDismiss }: ClinicalAlertsProps) => {
  const criticalAlerts = alerts.filter(alert => alert.severity === "critical");
  const warningAlerts = alerts.filter(alert => alert.severity === "warning");
  const infoAlerts = alerts.filter(alert => alert.severity === "info");

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Clinical Alerts & Recommendations
          <div className="flex gap-2">
            {criticalAlerts.length > 0 && (
              <Badge variant="destructive">
                {criticalAlerts.length} Critical
              </Badge>
            )}
            {warningAlerts.length > 0 && (
              <Badge className="bg-vital-warning/10 text-vital-warning">
                {warningAlerts.length} Warning
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg border-l-4 bg-card border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(alert.severity)}
                    <h4 className="font-medium">{alert.title}</h4>
                    <Badge variant="outline" className={getCategoryColor(alert.category)}>
                      {alert.category}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {alert.timestamp}
                    {alert.duration && <span>({alert.duration})</span>}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                
                {alert.recommendations.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Clinical Recommendations:
                    </p>
                    <ul className="text-xs space-y-1">
                      {alert.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {alert.actionRequired && !alert.acknowledgedBy && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onAcknowledge(alert.id)}
                        className="h-7 text-xs"
                      >
                        Acknowledge
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => onDismiss(alert.id)}
                      className="h-7 text-xs"
                    >
                      Dismiss
                    </Button>
                  </div>
                  {alert.acknowledgedBy && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>Ack by {alert.acknowledgedBy}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};