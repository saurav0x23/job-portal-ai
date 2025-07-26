import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const loadingMessages = [
  "Analyzing your resume with AI...",
  "Finding relevant jobs...",
  "Matching your skills...",
  "Preparing personalized recommendations...",
];

export default function ResumeAnalyzerLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500); // Rotate every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="w-4 h-4 animate-spin text-primary" />
      <span className="transition-opacity duration-500 ease-in-out">
        {loadingMessages[index]}
      </span>
    </div>
  );
}
