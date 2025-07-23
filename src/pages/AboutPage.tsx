import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Users, 
  Target, 
  Lightbulb, 
  Award,
  Github,
  Linkedin,
  Mail,
  Heart,
  Cpu,
  Smartphone,
  Cloud,
  ArrowRight
} from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      name: "Sakar Rana",
      role: "Frontend Devloper",
      bio:" ",
      icon: Heart
    },
    {
      name: "Gourav Batham",
      role: "Database Management",
      bio:" ",
      icon: Cpu
    },
    {
      name: "Rohan Singh",
      role: "Idea Generation",
      bio:" ",
      icon: Smartphone
    },
    {
      name: "Pramit Singh",
      role: "UI & UX",
      icon: Cloud ,
      bio:" "
    }
  ];

 const milestones = [
  {
    year: "2025",
    title: "Hackathon Inception",
    description:
      "Sanjeevan was conceptualized during a college hackathon to combat undetected health emergencies in elderly patients.",
  },
  {
    year: "2025",
    title: "Prototype Development",
    description:
      "Built the first wearable device prototype with basic vitals monitoring like heart rate and oxygen saturation.",
  },
  {
    year: "2025",
    title: "Beta Testing & Feedback",
    description:
      "Conducted beta testing with 100+ users across different age groups and refined the alert system based on real-life feedback.",
  },
  {
    year: "2026",
    title: "AI Integration",
    description:
      "Integrated AI to predict early warning signs using time-series health data and improved detection accuracy by 40%.",
  },
  {
    year: "2025",
    title: "Vercel + Cloud Deployment",
    description:
      "Launched the live health monitoring platform with secure cloud storage, accessible to users and families.",
  },
  {
    year: "2026",
    title: "Hospital Collaboration",
    description:
      "Partnered with hospitals and clinics to integrate Sanjeevan into real patient care workflows and emergency systems.",
  },
  {
    year: "2027",
    title: "Global Outreach",
    description:
      "Expanded to international markets, focusing on elderly care and rural health monitoring solutions.",
  },

  ];

  const values = [
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "Every decision we make is guided by what's best for patient health and well-being."
    },
    {
      icon: Target,
      title: "Early Detection",
      description: "We believe that early detection saves lives and prevents medical emergencies."
    },
    {
      icon: Users,
      title: "Family Connection",
      description: "Health monitoring isn't just about the patient - it's about peace of mind for families."
    },
    {
      icon: Award,
      title: "Innovation Excellence",
      description: "We continuously push the boundaries of what's possible in health technology."
    }
  ];

  const futureGoals = [
    "Integrate advanced PCB design for smaller, more efficient devices",
    "Expand sensor capabilities to include blood pressure and glucose monitoring",
    "Develop AI-powered health prediction algorithms",
    "Create partnerships with hospitals and healthcare providers",
    "Launch telemedicine integration for remote consultations",
    "Implement blockchain for secure health data management"
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-8 mb-16">
          <Badge variant="secondary" className="text-sm">
            About Our Mission
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Revolutionizing <span className="text-primary">Healthcare</span> with Technology
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sanjeevan Support was born from a simple yet powerful idea: what if technology 
            could predict and prevent medical emergencies before they happen?
          </p>
        </div>

        {/* Our Story */}
        <section className="mb-20">
          <Card className="bg-gradient-card shadow-medium border-0">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-foreground">Our Story</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Sanjeevan Support began as a hackathon project when our team witnessed 
                    the devastating impact of undetected medical emergencies in elderly patients. 
                    We realized that most health crises have warning signs that go unnoticed.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Our vision was clear: create an intelligent, wearable system that could 
                    monitor vital signs continuously and alert families before emergencies occur. 
                    What started as a prototype has evolved into a comprehensive health monitoring platform.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm"></span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span className="text-sm">Prototype tested with 100+ beta users</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-sm"></span>
                    </div>
                  </div>
                </div>
                <div className="bg-primary/5 p-6 rounded-lg">
                  <Lightbulb className="h-16 w-16 text-primary mb-4" />
                  <blockquote className="text-lg font-medium text-foreground mb-4">
                    "Technology should serve humanity's most basic need - staying healthy and safe."
                  </blockquote>
                  <cite className="text-muted-foreground">- Sanjeevan Support Team</cite>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Our Values */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-gradient-card shadow-soft hover:shadow-medium transition-smooth border-0 text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-soft">
                    <span className="text-sm font-bold">{milestone.year}</span>
                  </div>
                </div>
                <Card className="flex-1 bg-gradient-card shadow-soft border-0">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="bg-gradient-card shadow-soft hover:shadow-medium transition-smooth border-0">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <member.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                    <p className="text-primary text-sm font-medium">{member.role}</p>
                  </div>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                  <div className="flex justify-center space-x-3">
                    <Button variant="ghost" size="sm">
                      <Github className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Future Goals */}
        <section className="mb-16">
          <Card className="bg-gradient-secondary text-secondary-foreground shadow-medium border-0">
            <CardContent className="p-8">
              <div className="text-center space-y-6 mb-8">
                <h2 className="text-3xl font-bold">Future Roadmap</h2>
                <p className="text-lg opacity-90 max-w-2xl mx-auto">
                  We're just getting started. Here's what we're working on next to revolutionize healthcare monitoring.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {futureGoals.map((goal, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-white/20 p-1 rounded-full mt-1">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    <span className="text-sm opacity-90">{goal}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="text-center space-y-8 bg-muted/30 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-foreground">
            Join Our Mission
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Be part of the healthcare revolution. Whether you're a patient, healthcare provider, 
            or technology enthusiast, there's a place for you in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/register">Join as Patient</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
