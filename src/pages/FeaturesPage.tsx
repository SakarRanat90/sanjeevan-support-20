import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Bell, 
  Clock, 
  Users, 
  Cloud, 
  Shield,
  Smartphone,
  Heart,
  AlertTriangle,
  TrendingUp,
  Database,
  Wifi,
  Battery
} from "lucide-react";

export default function FeaturesPage() {
  const coreFeatures = [
    {
      icon: Activity,
      title: "Heart Rate Monitoring",
      description: "Continuous ECG-based heart rate tracking with arrhythmia detection",
      details: [
        "Real-time heart rate measurement",
        "Irregular heartbeat detection",
        "Heart rate variability analysis",
        "Exercise and stress monitoring"
      ],
      color: "text-red-500"
    },
    {
      icon: Thermometer,
      title: "Body Temperature Tracking",
      description: "Precise body temperature monitoring with fever alerts",
      details: [
        "Continuous temperature monitoring",
        "Fever spike detection",
        "Temperature trend analysis",
        "Climate-adjusted readings"
      ],
      color: "text-orange-500"
    },
    {
      icon: Droplets,
      title: "SpO2 Monitoring",
      description: "Blood oxygen saturation levels with hypoxemia alerts",
      details: [
        "Pulse oximetry measurement",
        "Oxygen saturation tracking",
        "Respiratory monitoring",
        "Sleep apnea detection"
      ],
      color: "text-blue-500"
    }
  ];

  const smartFeatures = [
    {
      icon: Bell,
      title: "Intelligent Alert System",
      description: "Sound-based alerts when vitals go outside normal ranges",
      details: [
        "Customizable alert thresholds",
        "Progressive alert escalation",
        "Silent and audible options",
        "Smart notification filtering"
      ]
    },
    {
      icon: Clock,
      title: "Medicine Reminders",
      description: "Smart medication scheduling with compliance tracking",
      details: [
        "Custom medication schedules",
        "Missed dose alerts",
        "Medication interaction warnings",
        "Adherence reporting"
      ]
    },
    {
      icon: Users,
      title: "Emergency Contacts",
      description: "Automatic alerts to caregivers and family members",
      details: [
        "Multi-contact emergency system",
        "SMS and call notifications",
        "Location sharing",
        "Emergency escalation protocols"
      ]
    },
    {
      icon: Cloud,
      title: "Cloud Data Sync",
      description: "Secure cloud storage with real-time synchronization",
      details: [
        "Encrypted data transmission",
        "Real-time backup",
        "Cross-device synchronization",
        "Data export capabilities"
      ]
    }
  ];

  const technicalFeatures = [
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "End-to-end encryption and HIPAA compliance"
    },
    {
      icon: Battery,
      title: "Long Battery Life",
      description: "Up to 30 days on a single charge"
    },
    {
      icon: Wifi,
      title: "Connectivity",
      description: "WiFi, Bluetooth, and cellular connectivity"
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Comprehensive mobile app for iOS and Android"
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-8 mb-16">
          <Badge variant="secondary" className="text-sm">
            Advanced Health Technology
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Comprehensive <span className="text-primary">Health Features</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sanjeevan Support combines cutting-edge IoT sensors with intelligent 
            algorithms to provide comprehensive health monitoring and emergency response.
          </p>
        </div>

        {/* Core Vital Monitoring */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-8">Core Vital Monitoring</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="bg-gradient-card shadow-soft hover:shadow-medium transition-smooth border-0">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full bg-muted ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {feature.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{detail}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Smart Features */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-8">Smart Health Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {smartFeatures.map((feature, index) => (
              <Card key={index} className="bg-gradient-card shadow-soft hover:shadow-medium transition-smooth border-0">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {feature.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span className="text-sm">{detail}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-8">Technical Specifications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalFeatures.map((feature, index) => (
              <Card key={index} className="bg-gradient-card shadow-soft hover:shadow-medium transition-smooth border-0 text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="p-4 rounded-full bg-accent/10 w-16 h-16 mx-auto flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Future Roadmap */}
        <section className="mb-16">
          <Card className="bg-gradient-secondary text-secondary-foreground shadow-medium border-0">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold">Future Roadmap</h2>
                <p className="text-lg opacity-90 max-w-2xl mx-auto">
                  We're continuously expanding Sanjeevan Support with new features and capabilities.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="space-y-2">
                    <TrendingUp className="h-8 w-8 mx-auto" />
                    <h3 className="font-semibold">AI Predictions</h3>
                    <p className="text-sm opacity-80">Machine learning for health trend prediction</p>
                  </div>
                  <div className="space-y-2">
                    <Database className="h-8 w-8 mx-auto" />
                    <h3 className="font-semibold">Advanced Analytics</h3>
                    <p className="text-sm opacity-80">Comprehensive health insights and reports</p>
                  </div>
                  <div className="space-y-2">
                    <Heart className="h-8 w-8 mx-auto" />
                    <h3 className="font-semibold">Extended Monitoring</h3>
                    <p className="text-sm opacity-80">Additional vital signs and health metrics</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            Ready to Experience Advanced Health Monitoring?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/register">Start Your Health Journey</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/how-it-works">Learn How It Works</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}