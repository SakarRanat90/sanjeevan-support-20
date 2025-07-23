import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Heart, Shield, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RegistrationPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalCondition: "",
    medicationTimes: [],
    agreeTerms: false
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const timeSlots = [
    "6:00 AM", "8:00 AM", "10:00 AM", "12:00 PM", 
    "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM", "10:00 PM"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTimeSlotToggle = (time: string) => {
    setFormData(prev => ({
      ...prev,
      medicationTimes: prev.medicationTimes.includes(time)
        ? prev.medicationTimes.filter(t => t !== time)
        : [...prev.medicationTimes, time]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Registration Successful!",
      description: "Welcome to Sanjeevan Support. Your health monitoring journey begins now.",
    });

    // Reset form
    setFormData({
      fullName: "",
      age: "",
      gender: "",
      bloodGroup: "",
      phone: "",
      emergencyContact: "",
      emergencyPhone: "",
      medicalCondition: "",
      medicationTimes: [],
      agreeTerms: false
    });
  };

  const features = [
    {
      icon: Heart,
      title: "Real-time Monitoring",
      description: "Track your vitals 24/7"
    },
    {
      icon: Shield,
      title: "Emergency Alerts",
      description: "Instant notifications to family"
    },
    {
      icon: Clock,
      title: "Medicine Reminders",
      description: "Never miss your medication"
    }
  ];

  return (
    <div className="min-h-screen py-12 bg-gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Side - Features */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <Badge variant="secondary" className="mb-4">
                Join Sanjeevan Support
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Start Your <span className="text-primary">Health Journey</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Register now to begin continuous health monitoring with intelligent alerts 
                and family connectivity.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Card className="bg-gradient-secondary text-secondary-foreground border-0 shadow-medium">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Why Register?</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Personalized health monitoring</li>
                  <li>• Custom alert thresholds</li>
                  <li>• Emergency contact integration</li>
                  <li>• Medication schedule management</li>
                  <li>• Health data analytics</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Registration Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card shadow-medium border-0">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <UserPlus className="h-6 w-6 text-primary mr-3" />
                  Patient Registration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="Your age"
                          value={formData.age}
                          onChange={(e) => handleInputChange("age", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender *</Label>
                        <Select onValueChange={(value) => handleInputChange("gender", value)}>
                          <SelectTrigger>
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
                        <Label htmlFor="bloodGroup">Blood Group *</Label>
                        <Select onValueChange={(value) => handleInputChange("bloodGroup", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                          <SelectContent>
                            {bloodGroups.map((group) => (
                              <SelectItem key={group} value={group}>{group}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                        <Input
                          id="emergencyContact"
                          placeholder="Emergency contact name"
                          value={formData.emergencyContact}
                          onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                        <Input
                          id="emergencyPhone"
                          type="tel"
                          placeholder="Emergency contact phone"
                          value={formData.emergencyPhone}
                          onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                      Medical Information
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="medicalCondition">Any Medical Conditions</Label>
                      <Textarea
                        id="medicalCondition"
                        placeholder="Please describe any existing medical conditions, allergies, or important medical history"
                        value={formData.medicalCondition}
                        onChange={(e) => handleInputChange("medicalCondition", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Medication Time Slots</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Select the times when you typically take medication:
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <div
                            key={time}
                            className={`cursor-pointer p-2 rounded-md border text-center text-sm transition-smooth ${
                              formData.medicationTimes.includes(time)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted hover:bg-muted/80 border-border"
                            }`}
                            onClick={() => handleTimeSlotToggle(time)}
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Terms and Submit */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, agreeTerms: checked as boolean }))
                        }
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <a href="#" className="text-primary hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      disabled={!formData.agreeTerms}
                    >
                      Complete Registration
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}