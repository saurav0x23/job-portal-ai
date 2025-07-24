"use client";

import Hero from "@/components/Hero";
import { JobsGrid } from "@/components/JobsGrid";
import { Button } from "@/components/ui/button";
import {
  Star,
  ArrowRight,
  CheckCircle,
  Users,
  Briefcase,
  TrendingUp,
  MapPin,
  Clock,
  Building2,
  ChevronDown,
  Quote,
  Award,
  Zap,
  FileText,
  Target,
  Globe,
  MoveUp,
} from "lucide-react";
import { useState } from "react";

const HomePage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Sample data - replace with real data from your API
  const featuredJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      description:
        "Join our team to build cutting-edge web applications using React and Next.js.",
      company: "TechCorp",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $160k",
      posted: "2 days ago",
      tags: ["React", "TypeScript", "Next.js"],
    },
    {
      id: 2,
      title: "Product Manager",
      description:
        "Lead product strategy and execution for our innovative SaaS platform.",
      company: "StartupCo",
      location: "Remote",
      type: "Full-time",
      salary: "$100k - $140k",
      posted: "1 day ago",
      tags: ["Product Strategy", "Analytics", "Agile"],
    },
    {
      id: 3,
      title: "UX Designer",
      description:
        "Design user-friendly interfaces and improve user experience for our mobile app.",
      company: "DesignHub",
      location: "New York, NY",
      type: "Contract",
      salary: "$80k - $110k",
      posted: "3 days ago",
      tags: ["Figma", "User Research", "Prototyping"],
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Google",
      image: "/api/placeholder/64/64",
      content:
        "CareerBoost AI helped me land my dream job at Google. The AI-powered resume enhancement was incredible!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "Microsoft",
      image: "/api/placeholder/64/64",
      content:
        "The job matching algorithm is spot-on. I received 5 interview offers within a week of uploading my resume.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist",
      company: "Netflix",
      image: "/api/placeholder/64/64",
      content:
        "Best career platform I've ever used. The personalized recommendations saved me hours of job searching.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "How does the AI resume enhancement work?",
      answer:
        "Our AI analyzes your resume against thousands of successful job applications and industry standards. It identifies areas for improvement, suggests better keywords, optimizes formatting, and ensures your resume passes through Applicant Tracking Systems (ATS).",
    },
    {
      question: "Is the platform free to use?",
      answer:
        "Yes! CareerBoost AI offers a free tier that includes basic resume analysis and job matching. We also offer premium plans with advanced features like unlimited resume revisions and priority job applications.",
    },
    {
      question: "How accurate is the job matching algorithm?",
      answer:
        "Our AI-powered matching algorithm has a 95% accuracy rate. It analyzes your skills, experience, preferences, and career goals to match you with the most relevant opportunities from our network of 500+ partner companies.",
    },
    {
      question: "Can I apply to jobs directly through the platform?",
      answer:
        "Absolutely! You can apply to jobs with one click directly through our platform. We also provide application tracking, interview scheduling, and follow-up reminders to streamline your job search process.",
    },
    {
      question: "What types of companies are in your network?",
      answer:
        "We partner with companies ranging from innovative startups to Fortune 500 enterprises across all industries including tech, finance, healthcare, marketing, and more. Our network includes remote, hybrid, and on-site opportunities.",
    },
  ];

  const stats = [
    { number: "50K+", label: "Jobs Posted", icon: Briefcase },
    { number: "25K+", label: "Happy Users", icon: Users },
    { number: "500+", label: "Partner Companies", icon: Building2 },
    { number: "95%", label: "Success Rate", icon: TrendingUp },
  ];

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description:
        "Our advanced AI analyzes your profile and matches you with the perfect job opportunities in seconds.",
    },
    {
      icon: FileText,
      title: "Resume Enhancement",
      description:
        "Get your resume optimized by AI to pass ATS systems and impress hiring managers.",
    },
    {
      icon: Target,
      title: "Personalized Recommendations",
      description:
        "Receive job recommendations tailored specifically to your skills, experience, and career goals.",
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description:
        "Access job opportunities from companies worldwide, including remote and hybrid positions.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose CareerBoost AI?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to accelerate your career growth and
              help you land your dream job faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Jobs
              </h2>
              <p className="text-xl text-muted-foreground">
                Hand-picked opportunities from top companies
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/jobs")}
            >
              View All Jobs
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <JobsGrid jobs={featuredJobs} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how CareerBoost AI has transformed careers and helped
              professionals land their dream jobs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-primary/20 mb-4" />

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about CareerBoost AI
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-background rounded-xl border overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>

          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals who've already accelerated their
            careers with CareerBoost AI. Your dream job is just one click away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-4 text-lg font-semibold"
              onClick={() => (window.location.href = "/resume")}
            >
              <FileText className="mr-2 w-5 h-5" />
              Upload Your Resume
            </Button>

            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-4 text-lg font-semibold hover:text-background-foreground/60"
              onClick={() => (window.location.href = "/jobs")}
            >
              Browse Jobs
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <div className="mt-8 text-sm opacity-75">
            ✨ No credit card required • Get started in seconds
          </div>
        </div>
      </section>
      <Button
        className="hidden md:flex items-center justify-center fixed bottom-4 right-4 bg-secondary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <MoveUp className="w-8 h-8" />
      </Button>
    </div>
  );
};

export default HomePage;
