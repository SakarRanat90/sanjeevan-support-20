import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Activity, Heart, Thermometer, Zap, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VitalReading {
  id: string;
  heart_rate: number;
  temperature: number;
  spo2: number;
  alert_flag: boolean;
  recorded_at: string;
}

export default function VitalsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [vitals, setVitals] = useState<VitalReading[]>([]);
  const [currentReading, setCurrentReading] = useState({
    heartRate: "",
    temperature: "",
    spo2: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    loadVitals();
  }, []);

  const loadVitals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("vitals")
        .select("*")
        .eq("user_id", user.id)
        .order("recorded_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error loading vitals:", error);
        return;
      }

      setVitals(data || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const vitalData = {
        user_id: user.id,
        heart_rate: parseInt(currentReading.heartRate),
        temperature: parseFloat(currentReading.temperature),
        spo2: parseInt(currentReading.spo2),
        recorded_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from("vitals")
        .insert([vitalData]);

      if (error) {
        throw error;
      }

      // Check if this reading would trigger an alert
      const isAlert = 
        vitalData.heart_rate < 60 || vitalData.heart_rate > 120 ||
        vitalData.temperature > 38.0 ||
        vitalData.spo2 < 92;

      toast({
        title: isAlert ? "Alert: Abnormal Reading" : "Vitals Recorded",
        description: isAlert 
          ? "Your vital signs are outside normal ranges. Please consult a healthcare provider."
          : "Your vital signs have been recorded successfully.",
        variant: isAlert ? "destructive" : "default"
      });

      setCurrentReading({ heartRate: "", temperature: "", spo2: "" });
      loadVitals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAlertLevel = (vital: VitalReading) => {
    if (vital.heart_rate < 60 || vital.heart_rate > 120) return "heart-rate";
    if (vital.temperature > 38.0) return "temperature";
    if (vital.spo2 < 92) return "spo2";
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            Vital Signs Monitoring
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your health vitals and get instant alerts for abnormal readings
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-gradient-card shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Record New Reading
              </CardTitle>
              <CardDescription>
                Enter your current vital signs measurements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="heartRate" className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Heart Rate (BPM)
                  </Label>
                  <Input
                    id="heartRate"
                    type="number"
                    min="30"
                    max="250"
                    value={currentReading.heartRate}
                    onChange={(e) => setCurrentReading(prev => ({ ...prev, heartRate: e.target.value }))}
                    placeholder="e.g., 72"
                    required
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground">Normal range: 60-120 BPM</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature" className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-blue-500" />
                    Temperature (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    min="30"
                    max="45"
                    value={currentReading.temperature}
                    onChange={(e) => setCurrentReading(prev => ({ ...prev, temperature: e.target.value }))}
                    placeholder="e.g., 36.5"
                    required
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground">Normal range: 36.1-37.2°C</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spo2" className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    SpO2 (%)
                  </Label>
                  <Input
                    id="spo2"
                    type="number"
                    min="70"
                    max="100"
                    value={currentReading.spo2}
                    onChange={(e) => setCurrentReading(prev => ({ ...prev, spo2: e.target.value }))}
                    placeholder="e.g., 98"
                    required
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground">Normal range: 95-100%</p>
                </div>

                <Alert className="bg-primary/10 border-primary/20">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    Automatic alerts will be triggered for readings outside normal ranges:
                    Heart Rate &lt;60 or &gt;120, Temperature &gt;38°C, SpO2 &lt;92%
                  </AlertDescription>
                </Alert>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
                  disabled={isLoading}
                >
                  {isLoading ? "Recording..." : "Record Vitals"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Readings */}
          <Card className="bg-gradient-card shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recent Readings
              </CardTitle>
              <CardDescription>
                Your latest vital sign measurements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vitals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No vitals recorded yet</p>
                    <p className="text-sm">Start by recording your first reading</p>
                  </div>
                ) : (
                  vitals.map((vital) => {
                    const alertLevel = getAlertLevel(vital);
                    return (
                      <Card key={vital.id} className={`border ${vital.alert_flag ? 'border-destructive/50 bg-destructive/5' : 'border-border'}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {formatDate(vital.recorded_at)}
                              </span>
                            </div>
                            {vital.alert_flag && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Alert
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div className={`text-center p-2 rounded-lg ${alertLevel === 'heart-rate' ? 'bg-destructive/10' : 'bg-muted/50'}`}>
                              <Heart className={`h-4 w-4 mx-auto mb-1 ${alertLevel === 'heart-rate' ? 'text-destructive' : 'text-red-500'}`} />
                              <div className="text-sm font-medium">{vital.heart_rate}</div>
                              <div className="text-xs text-muted-foreground">BPM</div>
                            </div>
                            <div className={`text-center p-2 rounded-lg ${alertLevel === 'temperature' ? 'bg-destructive/10' : 'bg-muted/50'}`}>
                              <Thermometer className={`h-4 w-4 mx-auto mb-1 ${alertLevel === 'temperature' ? 'text-destructive' : 'text-blue-500'}`} />
                              <div className="text-sm font-medium">{vital.temperature}°C</div>
                              <div className="text-xs text-muted-foreground">Temp</div>
                            </div>
                            <div className={`text-center p-2 rounded-lg ${alertLevel === 'spo2' ? 'bg-destructive/10' : 'bg-muted/50'}`}>
                              <Activity className={`h-4 w-4 mx-auto mb-1 ${alertLevel === 'spo2' ? 'text-destructive' : 'text-green-500'}`} />
                              <div className="text-sm font-medium">{vital.spo2}%</div>
                              <div className="text-xs text-muted-foreground">SpO2</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}