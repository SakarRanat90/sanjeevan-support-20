import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pill, Clock, Plus, CheckCircle, Calendar, AlertCircle, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Medication {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  schedule_times: string[];
  start_date: string;
  end_date?: string;
  is_active: boolean;
}

interface MedicationLog {
  id: string;
  medication_id: string;
  taken_at: string;
  scheduled_time: string;
  notes?: string;
}

export default function MedicationPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [scheduleInputs, setScheduleInputs] = useState<string[]>([""]);
  const { toast } = useToast();

  useEffect(() => {
    loadMedications();
    loadMedicationLogs();
  }, []);

  const loadMedications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading medications:", error);
        return;
      }

      setMedications(data || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const loadMedicationLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("taken_at", today + "T00:00:00.000Z")
        .order("taken_at", { ascending: false });

      if (error) {
        console.error("Error loading medication logs:", error);
        return;
      }

      setMedicationLogs(data || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddMedication = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const formData = new FormData(e.currentTarget);
      const validTimes = scheduleInputs.filter(time => time.trim() !== "");

      const medicationData = {
        user_id: user.id,
        medication_name: formData.get("medication_name") as string,
        dosage: formData.get("dosage") as string,
        frequency: formData.get("frequency") as string,
        schedule_times: validTimes,
        start_date: formData.get("start_date") as string,
        end_date: formData.get("end_date") as string || null,
      };

      const { error } = await supabase
        .from("medications")
        .insert([medicationData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Medication added",
        description: "Your medication schedule has been created successfully."
      });

      setShowAddForm(false);
      setScheduleInputs([""]);
      loadMedications();
      (e.target as HTMLFormElement).reset();
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

  const handleTakeMedication = async (medication: Medication, scheduledTime: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const logData = {
        medication_id: medication.id,
        user_id: user.id,
        scheduled_time: scheduledTime,
        taken_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("medication_logs")
        .insert([logData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Medication taken",
        description: `${medication.medication_name} has been logged as taken.`
      });

      loadMedicationLogs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeactivateMedication = async (medicationId: string) => {
    try {
      const { error } = await supabase
        .from("medications")
        .update({ is_active: false })
        .eq("id", medicationId);

      if (error) {
        throw error;
      }

      toast({
        title: "Medication deactivated",
        description: "The medication has been removed from your active list."
      });

      loadMedications();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const addScheduleInput = () => {
    setScheduleInputs([...scheduleInputs, ""]);
  };

  const updateScheduleInput = (index: number, value: string) => {
    const newInputs = [...scheduleInputs];
    newInputs[index] = value;
    setScheduleInputs(newInputs);
  };

  const removeScheduleInput = (index: number) => {
    if (scheduleInputs.length > 1) {
      setScheduleInputs(scheduleInputs.filter((_, i) => i !== index));
    }
  };

  const isMedicationTaken = (medicationId: string, scheduledTime: string) => {
    return medicationLogs.some(log => 
      log.medication_id === medicationId && 
      log.scheduled_time === scheduledTime
    );
  };

  const getNextDoseTime = (medication: Medication) => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    const nextTime = medication.schedule_times.find(time => time > currentTime);
    return nextTime || medication.schedule_times[0];
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Pill className="h-8 w-8 text-primary" />
            Medication Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your medications and never miss a dose
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Medication */}
          <Card className="bg-gradient-card shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Add Medication
                </span>
              </CardTitle>
              <CardDescription>
                Set up a new medication schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-primary hover:opacity-90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Medication
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Medication</DialogTitle>
                    <DialogDescription>
                      Enter your medication details and schedule
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddMedication} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="medication_name">Medication Name *</Label>
                      <Input
                        id="medication_name"
                        name="medication_name"
                        placeholder="e.g., Aspirin"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dosage">Dosage *</Label>
                      <Input
                        id="dosage"
                        name="dosage"
                        placeholder="e.g., 100mg"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency *</Label>
                      <Select name="frequency" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="once daily">Once daily</SelectItem>
                          <SelectItem value="twice daily">Twice daily</SelectItem>
                          <SelectItem value="three times daily">Three times daily</SelectItem>
                          <SelectItem value="four times daily">Four times daily</SelectItem>
                          <SelectItem value="as needed">As needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Schedule Times *</Label>
                      {scheduleInputs.map((time, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="time"
                            value={time}
                            onChange={(e) => updateScheduleInput(index, e.target.value)}
                            required
                          />
                          {scheduleInputs.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeScheduleInput(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addScheduleInput}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Time
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date *</Label>
                        <Input
                          id="start_date"
                          name="start_date"
                          type="date"
                          defaultValue={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end_date">End Date</Label>
                        <Input
                          id="end_date"
                          name="end_date"
                          type="date"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Adding..." : "Add Medication"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Active Medications */}
          <Card className="bg-gradient-card shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Active Medications
              </CardTitle>
              <CardDescription>
                Your current medication schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No medications added yet</p>
                    <p className="text-sm">Add your first medication to get started</p>
                  </div>
                ) : (
                  medications.map((medication) => (
                    <Card key={medication.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{medication.medication_name}</h4>
                            <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {medication.frequency}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeactivateMedication(medication.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">TODAY'S SCHEDULE</Label>
                          {medication.schedule_times.map((time) => (
                            <div key={time} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{time}</span>
                              </div>
                              {isMedicationTaken(medication.id, time) ? (
                                <Badge variant="secondary" className="text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Taken
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleTakeMedication(medication, time)}
                                >
                                  Mark Taken
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <Alert className="mt-3 bg-primary/10 border-primary/20">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          <AlertDescription className="text-sm">
                            Next dose: {getNextDoseTime(medication)}
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Today's Log */}
          <Card className="bg-gradient-card shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Today's Log
              </CardTitle>
              <CardDescription>
                Medications taken today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medicationLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No medications taken today</p>
                    <p className="text-sm">Start taking your scheduled medications</p>
                  </div>
                ) : (
                  medicationLogs.map((log) => {
                    const medication = medications.find(m => m.id === log.medication_id);
                    return (
                      <div key={log.id} className="flex items-center gap-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {medication?.medication_name || "Unknown medication"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Scheduled: {log.scheduled_time} | Taken: {new Date(log.taken_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
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