import { Users, Rocket, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  const stats = [
    { value: "10,000+", label: "Jobs Posted" },
    { value: "95%", label: "Match Success Rate" },
    { value: "500+", label: "Partner Companies" },
    { value: "24h", label: "Avg. Response Time" },
  ];

  const features = [
    {
      icon: <Rocket className="w-8 h-8 text-primary" />,
      title: "Our Mission",
      description:
        "To revolutionize job searching by leveraging AI to create perfect matches between talent and opportunity, eliminating the frustration of traditional job hunting.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Our Team",
      description:
        "A diverse group of tech enthusiasts, career coaches, and AI experts passionate about making career transitions smoother for everyone.",
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Our Vision",
      description:
        "A world where everyone can find meaningful work that aligns with their skills and aspirations, regardless of background or connections.",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-140px)] py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-muted-foreground bg-clip-text text-transparent">
          About SkillSync
        </h1>
        <p className="text-xl text-muted-foreground">
          We're transforming the job search experience through artificial
          intelligence and human-centered design.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
          >
            <p className="text-3xl font-bold mb-2">{stat.value}</p>
            <p className="text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Our Story */}
      <div className="max-w-4xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
        <div className="space-y-6 text-muted-foreground">
          <p>
            Founded in 2023, SkillSync emerged from our team's frustration with
            traditional job search platforms. We noticed that qualified
            candidates were being overlooked due to poorly optimized resumes and
            inefficient matching algorithms.
          </p>
          <p>
            Our platform was built to solve these problems by combining advanced
            natural language processing with industry-specific knowledge to
            create meaningful connections between job seekers and employers.
          </p>
          <p>
            Today, we're proud to serve thousands of users across multiple
            industries, helping them find fulfilling careers while enabling
            companies to discover exceptional talent.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">What Drives Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-border rounded-xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-card border border-border rounded-xl p-8 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to boost your career?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of professionals who've found their dream jobs through
          our platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">
            Learn How It Works
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
