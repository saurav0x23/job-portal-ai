import { create } from "zustand";

type Job = {
  id: string;
  title: string;
  company: string;
  description: string;
  required_skills: string[];
  relevance: number;
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
  fetchJobs: (resume: File) => Promise<void>;
  reset: () => void;
};

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  aiInsights: { titles: [], skills: [], experience: "" },
  loading: false,
  error: null,

  fetchJobs: async (resumeFile) => {
    set({ loading: true, error: null });

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const response = await fetch("/api/process-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const { jobs, aiInsights } = await response.json();
      set({ jobs, aiInsights, loading: false });
    } catch (error: any) {
      console.error("Fetch jobs failed:", error);
      set({
        loading: false,
        error: error.message || "Failed to process resume",
      });
    }
  },

  reset: () =>
    set({
      jobs: [],
      aiInsights: { titles: [], skills: [], experience: "" },
      error: null,
    }),
}));
