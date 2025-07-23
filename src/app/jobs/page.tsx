"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // Adjust path based on your folder structure
import { Button } from "@/components/ui/button";
import ApplyButon from "@/components/ApplyButton";

const JobsListingPage = () => {
  const [jobs, setJobs] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase.from("jobs").select("*");
      if (error) {
        console.error("Error fetching jobs:", error.message);
      } else {
        setJobs(data || []);
      }
    };

    fetchJobs();
  }, [supabase]);

  const handleClick = (jobId: string) => {
    window.location.href = `/jobs/${jobId}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <h1 className="text-3xl font-bold mb-6">Jobs Listing Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job: any) => (
          <Card
            key={job.id}
            className="shadow-sm border cursor-pointer hover:shadow-lg transition-shadow duration-300 ease-in-out"
            onClick={() => handleClick(job.id)}
          >
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>{job.company}</CardDescription>
              <CardAction>
                <ApplyButon />
              </CardAction>
            </CardHeader>
            <CardContent>
              <p>{job.description || "No description provided."}</p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Location: {job.location || "Remote"}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobsListingPage;
