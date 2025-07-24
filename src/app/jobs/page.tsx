"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { JobsGrid } from "@/components/JobsGrid";
import { Loader2, Briefcase, Search } from "lucide-react";

const JobsListingPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("jobs").select("*");
        if (error) {
          console.error("Error fetching jobs:", error.message);
        } else {
          setJobs(data || []);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-muted rounded-full"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium">Loading jobs...</p>
          <p className="text-xs text-muted-foreground">
            Finding the best opportunities for you
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-card/50 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                Job Opportunities
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover your next career move from our curated collection of
                opportunities
              </p>
            </div>
            {jobs.length > 0 && (
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>
                  {jobs.length} active position{jobs.length !== 1 ? "s" : ""}{" "}
                  available
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {jobs.length > 0 ? (
          <div className="space-y-8">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card rounded-xl p-6 border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{jobs.length}</p>
                    <p className="text-sm text-muted-foreground">Total Jobs</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {
                        jobs.filter(
                          (job) =>
                            new Date(job.posted_at) >
                            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        ).length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">This Week</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {[...new Set(jobs.map((job) => job.company))].length}
                    </p>
                    <p className="text-sm text-muted-foreground">Companies</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">All Positions</h2>
                <div className="text-sm text-muted-foreground">
                  Showing all {jobs.length} jobs
                </div>
              </div>
              <JobsGrid jobs={jobs} />
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-muted/50 mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No jobs available</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're currently updating our job listings. Check back soon for
                new opportunities!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsListingPage;
