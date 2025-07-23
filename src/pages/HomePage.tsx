import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Shield, 
  Clock, 
  Users, 
  ArrowRight, 
  Activity,
  Thermometer,
  Smartphone,
  Bell,
  TrendingUp
} from "lucide-react";
import heroImage from "@/assets/hero-smartwatch.jpg";

export default function HomePage() {
  const features = [
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Continuous tracking of heart rate, temperature, and SpO2 levels"
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Instant notifications when vitals go outside normal ranges"
    },
    {
      icon: Clock,
      title: "Medicine Reminders",
      description: "Never miss your medication with smart timing alerts"
    },
    {
      icon: Users,
      title: "Family Connect",
      description: "Emergency alerts sent to caregivers and family members"
    }
  ];
   const stats = [
    { value: "24/7", label: "Monitoring" },
    { value: "95%", label: "Accuracy" },
    { value: "30 Days", label: "Battery Life" },
    { value: "Many", label: "Lives Protected" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-sm">
                  IoT Health Monitoring System
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  <span className="text-primary">Smart Health,</span><br />
                  Timely Care
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Sanjeevan Support uses advanced IoT technology to monitor your vitals 
                  24/7, providing early alerts and saving lives through intelligent health tracking.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/features">
                    Learn More <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/auth">Start Monitoring</Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-gradient-card rounded-2xl p-8 shadow-glow">
                <img 
                  src={heroImage} 
                  alt="Sanjeevan Support Smartwatch" 
                  className="w-full h-auto rounded-lg shadow-medium"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-2xl blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Needed Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Why is <span className="text-primary">Sanjeevan Support</span> Needed?
            </h2>
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-card shadow-medium border-0">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center space-y-4">
                      <div className="bg-destructive/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <Thermometer className="h-8 w-8 text-destructive" />
                      </div>
                      <h3 className="text-lg font-semibold">Silent Emergencies</h3>
                      <p className="text-muted-foreground">
                        Many health emergencies happen without warning signs, 
                        especially in elderly patients.
                      </p>
                    </div>
                    <div className="text-center space-y-4">
                      <div className="bg-warning/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <Clock className="h-8 w-8 text-warning" />
                      </div>
                      <h3 className="text-lg font-semibold">Critical Time Window</h3>
                      <p className="text-muted-foreground">
                        The first few minutes are crucial in medical emergencies. 
                        Early detection saves lives.
                      </p>
                    </div>
                    <div className="text-center space-y-4">
                      <div className="bg-success/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <Shield className="h-8 w-8 text-success" />
                      </div>
                      <h3 className="text-lg font-semibold">Peace of Mind</h3>
                      <p className="text-muted-foreground">
                        Families need assurance that their loved ones are safe, 
                        especially when living independently.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Advanced Health <span className="text-primary">Monitoring Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our IoT-based system provides comprehensive health monitoring with 
              intelligent alerts and seamless family connectivity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card shadow-soft hover:shadow-medium transition-smooth border-0 group">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/features">
                Explore All Features <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">
              Ready to Protect Your Health?
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of users who trust Sanjeevan Support for their health monitoring needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="xl" asChild>
                <Link to="/auth">Get Started Now</Link>
              </Button>
              <Button variant="outline" size="xl" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
