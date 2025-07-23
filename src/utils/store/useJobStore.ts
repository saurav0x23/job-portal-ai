import { toast } from "sonner";
import { create } from "zustand";

type Job = {
  id: string;
  title: string;
  company: string;
  description: string;
  required_skills: string[];
  relevance: number;
  matchedSkills?: number;
};

type AIInsights = {
  titles: string[];
  skills: string[];
  experience: string;
};

type JobState = {
  jobs: Job[];
  aiInsights: AIInsights;
  loading: boolean;
  error: string | null;
  fetchJobs: (resumeUrl: string) => Promise<void>;
  reset: () => void;
};

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  aiInsights: { titles: [], skills: [], experience: "" },
  loading: false,
  error: null,

  fetchJobs: async (resumeUrl: string) => {
    set({ loading: true, error: null });

    try {
      // Verify the URL is valid
      if (!resumeUrl || !resumeUrl.startsWith("http")) {
        throw new Error("Invalid resume URL");
      }

      // Create FormData and append the URL
      const formData = new FormData();
      formData.append("resumeUrl", resumeUrl);

      // Make the API request
      const response = await fetch("/api/process-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.jobs || !result.aiInsights) {
        throw new Error("Invalid response format from server");
      }

      set({
        jobs: result.jobs,
        aiInsights: result.aiInsights,
        loading: false,
        error: null,
      });

      toast.success(
        `Found ${result.jobs.length} matching jobs!` +
          (result.summary ? ` Top match: ${result.summary.topRelevance}%` : "")
      );
    } catch (error: any) {
      console.error("Job recommendation error:", error);
      set({
        loading: false,
        error: error.message || "Failed to get job recommendations",
        jobs: [],
        aiInsights: { titles: [], skills: [], experience: "" },
      });
      toast.error(error.message || "Failed to process resume");
    }
  },

  reset: () => {
    set({
      jobs: [],
      aiInsights: { titles: [], skills: [], experience: "" },
      error: null,
      loading: false,
    });
  },
}));
