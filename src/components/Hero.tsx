"use client";

import { Button } from "./ui/button";
import { useState, useEffect, useMemo } from "react";
import { ArrowRight, Sparkles, Briefcase, FileText, Zap } from "lucide-react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const rotatingTexts = [
    "Land your dream job with CareerBoost AI",
    "Transform your career with AI power",
    "Get matched with perfect opportunities",
  ];

  // Generate random particles with unique properties
  const particles = useMemo(() => {
    return Array.from({ length: 105 }).map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
      color: `rgba(99, 102, 241, ${Math.random() * 0.3 + 0.1})`, // primary color with varying opacity
      path: Math.floor(Math.random() * 4), // random path variation
    }));
  }, []);

  useEffect(() => {
    setIsVisible(true);

    const textInterval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);

    return () => clearInterval(textInterval);
  }, []);

  const features = [
    { icon: FileText, text: "AI Resume Enhancement" },
    { icon: Zap, text: "Instant Job Matching" },
    { icon: Briefcase, text: "Dream Career Path" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-foreground rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Randomized floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              animation: `floatRandom${particle.path} ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center p-4 space-y-4 mx-auto w-full max-w-4xl">
        {/* Main heading with smooth rotation effect */}
        <div
          className={`transition-all duration-1000 w-full ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary-foreground backdrop-blur-sm rounded-full border border-primary/20 shadow-lg">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              AI-Powered Career Platform
            </span>
          </div>

          <div className="relative w-full h-32 md:h-40 flex items-center justify-center">
            <h1
              className={`absolute w-full text-4xl md:text-6xl lg:text-7xl font-black leading-tight transition-all duration-500 ease-in-out ${
                isTransitioning
                  ? "opacity-0 translate-y-8 blur-sm"
                  : "opacity-100 translate-y-0 blur-0"
              }`}
            >
              <span className="bg-gradient-to-r from-foreground via-primary to-muted-foreground bg-clip-text text-transparent">
                {rotatingTexts[currentText]}
              </span>
            </h1>
          </div>
        </div>

        {/* Description */}
        <div
          className={`transition-all duration-1000 delay-300 w-full ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Upload your resume, let our advanced AI enhance it instantly, and
            get matched with personalized job opportunities from top companies.
            Your dream career is
            <span className="font-semibold text-primary">
              {" "}
              just one click away.
            </span>
          </p>
        </div>

        {/* Feature pills */}
        <div
          className={`transition-all duration-1000 delay-500 w-full ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-wrap justify-center gap-4 mb-8 w-full">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full shadow-lg border hover:shadow-xl hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className={`transition-all duration-1000 delay-700 w-full ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
            <Button
              size="lg"
              className="group px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => (window.location.href = "/jobs")}
            >
              Browse Jobs
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300"
              onClick={() => (window.location.href = "/resume")}
            >
              <FileText className="mr-2 w-5 h-5" />
              Upload Resume
            </Button>
          </div>
        </div>

        {/* Trust indicators */}
        <div
          className={`transition-all duration-1000 delay-1000 w-full ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground w-full">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>10,000+ Jobs Posted Daily</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>500+ Partner Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>95% Match Success Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
