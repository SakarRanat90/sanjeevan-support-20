import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Pill, 
  User, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  Download,
  Droplets,
  Bell
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  full_name: string;
  age: number;
  blood_group?: string;
}

interface VitalReading {
  heart_rate: number;
  temperature: number;
  spo2: number;
  alert_flag: boolean;
  recorded_at: string;
}

interface Medication {
  id: string;
  medication_name: string;
  schedule_times: string[];
  is_active: boolean;
}

interface MedicationLog {
  medication_id: string;
  scheduled_time: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [latestVitals, setLatestVitals] = useState<VitalReading | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);

      // Load latest vitals
      const { data: vitalsData } = await supabase
        .from('vitals')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();
      
      setLatestVitals(vitalsData);

      // Load medications
      const { data: medicationsData } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      setMedications(medicationsData || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock vitals data if no real data exists
  const vitals = latestVitals || {
    heart_rate: 72,
    temperature: 98.6,
    spo2: 98,
    alert_flag: false,
    recorded_at: new Date().toISOString()
  };

  const getVitalStatus = (type: string, value: number) => {
    switch (type) {
      case 'heartRate':
        if (value < 60 || value > 100) return 'warning';
        return 'normal';
      case 'temperature':
        if (value > 99.5) return 'warning';
        if (value < 97.0) return 'warning';
        return 'normal';
      case 'spO2':
        if (value < 95) return 'critical';
        if (value < 98) return 'warning';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'warning': return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
      case 'normal': return <Badge className="bg-success text-success-foreground">Normal</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  // Mock medication schedule data
  const medicationSchedule = [
    { name: "Aspirin", time: "8:00 AM", taken: true, nextDue: "8:00 PM" },
    { name: "Metformin", time: "12:00 PM", taken: false, nextDue: "12:00 PM" },
    { name: "Lisinopril", time: "6:00 PM", taken: false, nextDue: "6:00 PM" }
  ];

  const alerts = [
    { 
      type: "info", 
      message: "Heart rate returned to normal", 
      time: "10 minutes ago",
      icon: Heart
    },
    { 
      type: "warning", 
      message: "Temperature slightly elevated", 
      time: "25 minutes ago",
      icon: Thermometer
    },
    { 
      type: "success", 
      message: "Medication reminder acknowledged", 
      time: "1 hour ago",
      icon: CheckCircle
    }
  ];

  const handleMedicationTaken = (medicationName: string) => {
    toast({
      title: "Medication Confirmed",
      description: `${medicationName} has been marked as taken.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Health Dashboard</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date(vitals.recorded_at).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>
        </div>

        {/* Real-time Vitals */}
        <section className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Heart Rate */}
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  Heart Rate
                </CardTitle>
                {getStatusBadge(getVitalStatus('heartRate', vitals.heart_rate))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-foreground">{vitals.heart_rate}</span>
                  <span className="text-muted-foreground ml-2">bpm</span>
                </div>
                <Progress value={(vitals.heart_rate / 120) * 100} className="h-2" />
                <div className="flex items-center text-sm text-muted-foreground">
                  <Activity className="h-4 w-4 mr-1" />
                  Normal range: 60-100 bpm
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Body Temperature */}
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Thermometer className="h-5 w-5 text-orange-500 mr-2" />
                  Temperature
                </CardTitle>
                {getStatusBadge(getVitalStatus('temperature', vitals.temperature))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-foreground">{vitals.temperature}</span>
                  <span className="text-muted-foreground ml-2">°F</span>
                </div>
                <Progress value={((vitals.temperature - 95) / 8) * 100} className="h-2" />
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Normal range: 97.0-99.5°F
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SpO2 */}
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                  Blood Oxygen
                </CardTitle>
                {getStatusBadge(getVitalStatus('spO2', vitals.spo2))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-foreground">{vitals.spo2}</span>
                  <span className="text-muted-foreground ml-2">%</span>
                </div>
                <Progress value={vitals.spo2} className="h-2" />
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Normal range: 95-100%
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Medication Reminders */}
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-2" />
                Medication Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {medicationSchedule.map((med, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <h4 className="font-medium">{med.name}</h4>
                    <p className="text-sm text-muted-foreground">Next: {med.nextDue}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {med.taken ? (
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Taken
                      </Badge>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMedicationTaken(med.name)}
                      >
                        I've taken this
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 text-primary mr-2" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-warning/10' : 
                    alert.type === 'success' ? 'bg-success/10' : 'bg-primary/10'
                  }`}>
                    <alert.icon className={`h-4 w-4 ${
                      alert.type === 'warning' ? 'text-warning' : 
                      alert.type === 'success' ? 'text-success' : 'text-primary'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Emergency Info */}
        <Card className="mt-8 bg-destructive/5 border-destructive/20 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-destructive/10 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Emergency Protocol</h3>
                <p className="text-sm text-muted-foreground">
                  If you experience severe symptoms, call emergency services immediately. 
                  Your emergency contacts have been notified of your current vital signs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}