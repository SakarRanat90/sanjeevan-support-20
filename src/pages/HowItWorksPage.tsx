import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Watch, 
  Activity, 
  AlertTriangle, 
  Smartphone, 
  Bell,
  ArrowRight,
  CheckCircle,
  Users,
  Cloud,
  Heart,
  Clock,
  Shield
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      icon: Watch,
      title: "Wear the Sanjeevan Support Band",
      description: "Put on your comfortable, lightweight health monitoring device that fits like a regular smartwatch.",
      details: [
        "Secure, comfortable fit for 24/7 wear",
        "Water-resistant design for daily activities",
        "Easy one-time setup and pairing"
      ],
      color: "bg-primary"
    },
    {
      number: 2,
      icon: Activity,
      title: "Continuous Vital Monitoring",
      description: "Advanced sensors automatically track your heart rate, body temperature, and SpO2 levels in real-time.",
      details: [
        "Heart rate monitoring every 30 seconds",
        "Temperature checks every 5 minutes",
        "SpO2 monitoring during sleep and activity"
      ],
      color: "bg-secondary"
    },
    {
      number: 3,
      icon: AlertTriangle,
      title: "Intelligent Alert Detection",
      description: "Our AI algorithms analyze your vitals and detect when readings go outside your normal ranges.",
      details: [
        "Personalized baseline establishment",
        "Smart threshold adjustments",
        "False alarm reduction technology"
      ],
      color: "bg-accent"
    },
    {
      number: 4,
      icon: Smartphone,
      title: "Real-time Dashboard Updates",
      description: "View your current vitals and health trends on our intuitive web dashboard and mobile app.",
      details: [
        "Live vital signs display",
        "Historical health data trends",
        "Medication adherence tracking"
      ],
      color: "bg-primary"
    },
    {
      number: 5,
      icon: Bell,
      title: "Smart Medication Reminders",
      description: "Never miss your medication with intelligent reminders and easy confirmation system.",
      details: [
        "Customizable medication schedules",
        "Gentle reminder notifications",
        "One-tap confirmation system"
      ],
      color: "bg-secondary"
    },
    {
      number: 6,
      icon: Users,
      title: "Emergency Family Alerts",
      description: "In case of emergency, your family and caregivers are automatically notified with your location and vitals.",
      details: [
        "Instant SMS and call notifications",
        "GPS location sharing",
        "Medical information access"
      ],
      color: "bg-accent"
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Peace of Mind",
      description: "Know that you're protected 24/7 with continuous health monitoring"
    },
    {
      icon: Clock,
      title: "Early Detection",
      description: "Catch health issues before they become serious emergencies"
    },
    {
      icon: Shield,
      title: "Family Safety",
      description: "Keep your loved ones informed and prepared for any situation"
    },
    {
      icon: Cloud,
      title: "Data Security",
      description: "Your health data is encrypted and securely stored in the cloud"
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-8 mb-16">
          <Badge variant="secondary" className="text-sm">
            How It Works
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Simple Steps to <span className="text-primary">Better Health</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sanjeevan Support makes health monitoring effortless. Here's how our 
            intelligent system works to keep you and your loved ones safe.
          </p>
        </div>

        {/* Step-by-step Process */}
        <section className="mb-20">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <Card key={index} className="bg-gradient-card shadow-soft hover:shadow-medium transition-smooth border-0">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-1 flex justify-center lg:justify-start">
                      <div className={`${step.color} text-white p-4 rounded-full w-16 h-16 flex items-center justify-center shadow-medium`}>
                        <step.icon className="h-8 w-8" />
                      </div>
                    </div>
                    
                    <div className="lg:col-span-11 space-y-4">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="text-xs">
                          Step {step.number}
                        </Badge>
                        <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                      </div>
                      
                      <p className="text-lg text-muted-foreground">{step.description}</p>
                      
                      <div className="grid md:grid-cols-3 gap-4 mt-6">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                            <span className="text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Flow Diagram */}
        <section className="mb-20">
          <Card className="bg-gradient-primary text-primary-foreground shadow-medium border-0">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8">Quick Overview</h2>
              <div className="grid md:grid-cols-6 gap-4 items-center">
                <div className="text-center space-y-2">
                  <div className="bg-white/20 p-3 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                    <Watch className="h-6 w-6" />
                  </div>
                  <p className="text-sm">Wear Device</p>
                </div>
                <ArrowRight className="h-6 w-6 mx-auto text-white/60" />
                <div className="text-center space-y-2">
                  <div className="bg-white/20 p-3 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                    <Activity className="h-6 w-6" />
                  </div>
                  <p className="text-sm">Monitor Vitals</p>
                </div>
                <ArrowRight className="h-6 w-6 mx-auto text-white/60" />
                <div className="text-center space-y-2">
                  <div className="bg-white/20 p-3 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <p className="text-sm">View Dashboard</p>
                </div>
                <ArrowRight className="h-6 w-6 mx-auto text-white/60" />
                <div className="text-center space-y-2">
                  <div className="bg-white/20 p-3 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <p className="text-sm">Alert Family</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Why Choose Sanjeevan Support?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-gradient-card shadow-soft hover:shadow-medium transition-smooth border-0 text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center space-y-8 bg-muted/30 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-foreground">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who trust Sanjeevan Support for intelligent health monitoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/register">Register Now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/dashboard">View Demo Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}