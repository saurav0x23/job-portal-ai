// app/jobs/[id]/page.tsx
import ApplyButon from "@/components/ApplyButton";
import BackButton from "@/components/BackButton";
import { createClient } from "@/utils/supabase/client";
import {
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  Clock,
  Users,
  CheckCircle,
  Tag,
  AlertTriangle,
} from "lucide-react";
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
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-50 border border-red-200">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Job Not Found</h1>
          <p className="text-muted-foreground max-w-md">
            {error?.message ||
              "The job you're looking for doesn't exist or has been removed."}
          </p>
        </div>
        <BackButton />
      </div>
    );
  }

  const isRecent =
    new Date(job.posted_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BackButton />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Header */}
        <div className="space-y-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <h1 className="text-3xl font-bold tracking-tight pr-4">
                  {job.title}
                </h1>
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">{job.company}</span>
                  </div>
                  {job.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.type && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.type}</span>
                    </div>
                  )}
                </div>
              </div>
              {isRecent && (
                <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>New</span>
                </div>
              )}
            </div>

            {/* Job Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg p-4 border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Posted</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(job.posted_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {job.salary_range && (
                <div className="bg-card rounded-lg p-4 border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Salary</p>
                      <p className="text-sm text-muted-foreground">
                        {job.salary_range}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-card rounded-lg p-4 border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Job ID</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      #{job.id.slice(0, 8)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-sm"></div>
                </div>
                <span>Job Description</span>
              </h2>
              <div className="prose prose-sm max-w-none">
                <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className="bg-card rounded-xl p-6 border">
                <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  <span>Requirements</span>
                </h2>
                <div className="space-y-3">
                  {job.requirements.map((req: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-muted-foreground leading-relaxed">
                        {req}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {job.tags?.length > 0 && (
              <div className="bg-card rounded-xl p-6 border">
                <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Tag className="w-3 h-3 text-blue-600" />
                  </div>
                  <span>Skills & Technologies</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium bg-muted hover:bg-muted/80 rounded-full transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Apply Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Apply Card */}
              <div className="bg-card rounded-xl p-6 border">
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold">Ready to apply?</h3>
                    <p className="text-sm text-muted-foreground">
                      Take the next step in your career journey
                    </p>
                  </div>
                  <ApplyButon />
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-card rounded-xl p-6 border">
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>About {job.company}</span>
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Company</span>
                    <span className="font-medium text-foreground">
                      {job.company}
                    </span>
                  </div>
                  {job.location && (
                    <div className="flex items-center justify-between">
                      <span>Location</span>
                      <span className="font-medium text-foreground">
                        {job.location}
                      </span>
                    </div>
                  )}
                  {job.type && (
                    <div className="flex items-center justify-between">
                      <span>Type</span>
                      <span className="font-medium text-foreground">
                        {job.type}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Stats */}
              <div className="bg-card rounded-xl p-6 border">
                <h3 className="font-semibold mb-3">Job Details</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Posted</span>
                    <span className="font-medium text-foreground">
                      {Math.ceil(
                        (Date.now() - new Date(job.posted_at).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days ago
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Job ID</span>
                    <span className="font-mono text-xs font-medium text-foreground">
                      {job.id.slice(0, 8)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
