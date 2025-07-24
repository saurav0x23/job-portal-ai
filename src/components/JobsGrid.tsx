"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // Adjust path based on your folder structure
import ApplyButon from "@/components/ApplyButton";
export const JobsGrid = ({ jobs }: { jobs: any[] }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        No jobs found
      </div>
    );
  }

  const handleClick = (jobId: string) => {
    window.location.href = `/jobs/${jobId}`;
  };

  return (
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
            <span className="text-sm text-muted-foreground">
              {job.type || "Full-time"}
            </span>
            {job.posted && (
              <span className="text-sm text-muted-foreground">
                {job.posted}
              </span>
            )}
            <span className="text-sm text-muted-foreground ml-2 ">
              {job.salary ? `${job.salary}/year` : "Salary not disclosed"}
            </span>
            {job.skills}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Location: {job.location || "Remote"}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
