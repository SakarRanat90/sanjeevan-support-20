import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Phone, MapPin, Heart, AlertCircle, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function PatientProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [diseases, setDiseases] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newDisease, setNewDisease] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading profile:", error);
        return;
      }

      if (data) {
        setProfile(data);
        setDiseases(data.known_diseases || []);
        setMedications(data.current_medications || []);
        setAllergies(data.allergy_history || []);
      }
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

      const formData = new FormData(e.currentTarget);
      const profileData = {
        id: user.id,
        full_name: formData.get("full_name") as string,
        age: parseInt(formData.get("age") as string),
        gender: formData.get("gender") as string,
        contact_number: formData.get("contact_number") as string,
        emergency_contact: formData.get("emergency_contact") as string,
        address: formData.get("address") as string,
        blood_group: formData.get("blood_group") as string,
        known_diseases: diseases,
        current_medications: medications,
        allergy_history: allergies,
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(profileData);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile saved",
        description: "Your patient profile has been updated successfully."
      });
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

  const addItem = (item: string, setItem: (value: string) => void, list: string[], setList: (list: string[]) => void) => {
    if (item.trim() && !list.includes(item.trim())) {
      setList([...list, item.trim()]);
      setItem("");
    }
  };

  const removeItem = (index: number, list: string[], setList: (list: string[]) => void) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <User className="h-8 w-8 text-primary" />
            Patient Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete your medical profile for personalized health monitoring
          </p>
        </div>

        <Card className="bg-gradient-card shadow-medium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Medical Information
            </CardTitle>
            <CardDescription>
              Please provide accurate information for better health monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    defaultValue={profile?.full_name || ""}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    min="1"
                    max="150"
                    defaultValue={profile?.age || ""}
                    required
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select name="gender" defaultValue={profile?.gender || ""}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blood_group">Blood Group</Label>
                  <Select name="blood_group" defaultValue={profile?.blood_group || ""}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact_number" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Number *
                  </Label>
                  <Input
                    id="contact_number"
                    name="contact_number"
                    type="tel"
                    defaultValue={profile?.contact_number || ""}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Emergency Contact *
                  </Label>
                  <Input
                    id="emergency_contact"
                    name="emergency_contact"
                    type="tel"
                    defaultValue={profile?.emergency_contact || ""}
                    required
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address *
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  defaultValue={profile?.address || ""}
                  required
                  className="bg-background/50"
                />
              </div>

              {/* Medical History */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Medical History</h3>
                
                {/* Known Diseases */}
                <div className="space-y-2">
                  <Label>Known Diseases / Medical Conditions</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newDisease}
                      onChange={(e) => setNewDisease(e.target.value)}
                      placeholder="Add a condition"
                      className="bg-background/50"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addItem(newDisease, setNewDisease, diseases, setDiseases)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {diseases.map((disease, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {disease}
                        <button
                          type="button"
                          onClick={() => removeItem(index, diseases, setDiseases)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Current Medications */}
                <div className="space-y-2">
                  <Label>Current Medications</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      placeholder="Add a medication"
                      className="bg-background/50"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addItem(newMedication, setNewMedication, medications, setMedications)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {medications.map((medication, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {medication}
                        <button
                          type="button"
                          onClick={() => removeItem(index, medications, setMedications)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Allergy History */}
                <div className="space-y-2">
                  <Label>Allergy History</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      placeholder="Add an allergy"
                      className="bg-background/50"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addItem(newAllergy, setNewAllergy, allergies, setAllergies)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((allergy, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {allergy}
                        <button
                          type="button"
                          onClick={() => removeItem(index, allergies, setAllergies)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}