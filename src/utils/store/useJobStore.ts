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

type JobState = {
  jobs: Job[];
  relevence: number;
  loading: boolean;
  error: string | null;
  fetchJobs: (resumeUrl: string) => Promise<void>;
  reset: () => void;
};

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  relevence: 0,
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

      if (!result.jobs) {
        throw new Error("Invalid response format from server");
      }
      console.log("Job recommendations:", result);

      set({
        jobs: result.jobs,
        relevence: result.relevence || 0,
        loading: false,
        error: null,
      });
      console.log("Job recommendations fetched successfully:", result.jobs);

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
        relevence: 0,
      });
      toast.error(error.message || "Failed to process resume");
    }
  },

  reset: () => {
    set({
      jobs: [],
      relevence: 0,
      error: null,
      loading: false,
    });
  },
}));
