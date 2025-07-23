// app/jobs/[id]/page.tsx
import ApplyButon from "@/components/ApplyButton";
import BackButton from "@/components/BackButton";
import { createClient } from "@/utils/supabase/client";
import React from "react";

type JobPageProps = {
  params: { id: string };
};

export default async function JobPage({ params }: JobPageProps) {
  const supabase = createClient();
  const jobId = params.id;

  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading job: {error?.message || "Not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12">
      <BackButton />
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <p className="text-lg text-muted-foreground">
          {job.company} · {job.location || "Remote"} · {job.type || "N/A"}
        </p>
        <p className="text-sm text-muted-foreground">
          Posted on: {new Date(job.posted_at).toLocaleDateString()}
        </p>
        <p className="text-sm text-muted-foreground">
          Salary Range: {job.salary_range || "Not specified"}
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {job.requirements?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Requirements</h2>
            <ul className="list-disc list-inside space-y-1">
              {job.requirements.map((req: string, index: number) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {job.tags?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-muted rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <ApplyButon />

        <p className="text-xs text-muted-foreground">Job ID: {job.id}</p>
      </div>
    </div>
  );
}
