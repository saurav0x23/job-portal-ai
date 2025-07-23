"use client";

import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Briefcase, FileText, Zap } from "lucide-react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentText, setCurrentText] = useState(0);

  const rotatingTexts = [
    "Land your dream job with CareerBoost AI",
    "Transform your career with AI power",
    "Get matched with perfect opportunities",
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: FileText, text: "AI Resume Enhancement" },
    { icon: Zap, text: "Instant Job Matching" },
    { icon: Briefcase, text: "Dream Career Path" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-foreground rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center p-8 space-y-8">
        {/* Main heading with rotation effect */}
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200 shadow-lg">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-accent-foreground">
              AI-Powered Career Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black max-w-4xl leading-tight">
            <span className="bg-gradient-to-r from-accent-foreground via-primary to-muted-foreground bg-clip-text text-transparent transition-all duration-1000 ease-in-out">
              {rotatingTexts[currentText]}
            </span>
          </h1>
        </div>

        {/* Description */}
        <div
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Upload your resume, let our advanced AI enhance it instantly, and
            get matched with personalized job opportunities from top companies.
            Your dream career is
            <span className="font-semibold text-purple-600">
              {" "}
              just one click away.
            </span>
          </p>
        </div>

        {/* Feature pills */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <feature.icon className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className={`transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant={"default"}
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
              className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              onClick={() => (window.location.href = "/resume")}
            >
              <FileText className="mr-2 w-5 h-5" />
              Upload Resume
            </Button>
          </div>
        </div>

        {/* Trust indicators */}
        <div
          className={`transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
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

      {/* Bottom wave */}
      <div className="absolute bottom-0 w-full">
        <svg
          className="w-full h-20 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
