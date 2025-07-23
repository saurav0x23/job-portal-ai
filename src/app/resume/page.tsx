"use client";
import { Button } from "@/components/ui/button";
import { useJobStore } from "@/utils/store/useJobStore";
import { createClient } from "@/utils/supabase/client";
import { Loader2, UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

export default function UploadResume() {
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumeChecked, setResumeChecked] = useState(false);
  const { jobs, fetchJobs } = useJobStore();

  const supabase = createClient();
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  // Check resume on mount
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          window.location.href = "/login";
          return;
        }

        const resumePath = `resumes/${user.id}/resume.pdf`;

        // First check if file exists
        const { data: fileData } = await supabase.storage
          .from("resume")
          .list(`resumes/${user.id}`);

        if (fileData && fileData.length > 0) {
          const { data: urlData } = supabase.storage
            .from("resume")
            .getPublicUrl(resumePath);

          setFileUrl(urlData.publicUrl);
          toast.success("Resume found!");
        }
      } catch (e) {
        console.error("Error checking resume:", e);
        toast.error("Error checking for existing resume");
      } finally {
        setResumeChecked(true);
      }
    };

    fetchResume();
  }, [supabase]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept: {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
      },
      maxSize: maxFileSize,
      multiple: false,
      disabled: uploading,
      onDropAccepted: async (acceptedFiles) => {
        const file = acceptedFiles[0];
        setUploading(true);
        setFileUrl(null);

        try {
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser();

          if (authError || !user) {
            throw new Error("Authentication required");
          }

          const fileExt = file.name.split(".").pop();
          const fileName = `resume.${fileExt}`;
          const filePath = `resumes/${user.id}/${fileName}`;

          // Remove existing resume if any
          const { data: existingFiles } = await supabase.storage
            .from("resume")
            .list(`resumes/${user.id}`);

          if (existingFiles && existingFiles.length > 0) {
            await supabase.storage
              .from("resume")
              .remove(existingFiles.map((f) => `resumes/${user.id}/${f.name}`));
          }

          // Upload new file
          const { error: uploadError } = await supabase.storage
            .from("resume")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: true,
            });

          if (uploadError) throw uploadError;

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("resume").getPublicUrl(filePath);

          setFileUrl(publicUrl);
          toast.success("Resume uploaded successfully!");
        } catch (err) {
          console.error("Upload error:", err);
          toast.error(err.message || "Failed to upload resume");
        } finally {
          setUploading(false);
        }
      },
      onDropRejected: (fileRejections) => {
        const rejection = fileRejections[0];
        const error = rejection.errors[0];
        toast.error(
          error.code === "file-too-large"
            ? "File size exceeds 5MB"
            : "Invalid file format. Please upload PDF or DOCX"
        );
      },
    });

  const handleRecommendJobs = async () => {
    if (!fileUrl) {
      toast.error("Please upload a resume first");
      return;
    }

    setLoading(true);
    try {
      await fetchJobs(fileUrl);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to get job recommendations");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveResume = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Authentication required");
      }

      const { data: files } = await supabase.storage
        .from("resume")
        .list(`resumes/${user.id}`);

      if (files && files.length > 0) {
        await supabase.storage
          .from("resume")
          .remove(files.map((f) => `resumes/${user.id}/${f.name}`));
      }

      setFileUrl(null);
      toast.success("Resume removed successfully");
    } catch (error) {
      console.error("Error removing resume:", error);
      toast.error("Failed to remove resume");
    }
  };

  if (!resumeChecked) {
    return (
      <div className="text-center py-12">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Checking your resume...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!fileUrl && (
        <div
          {...getRootProps()}
          className={`border-dashed border-2 rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-muted" : "border-muted"
          } ${uploading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="mx-auto h-12 w-12 text-muted-foreground animate-spin" />
              <p className="mt-4">Uploading resume...</p>
            </div>
          ) : (
            <>
              <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 font-medium">Drag & drop your resume</p>
              <p className="text-sm text-muted-foreground">
                PDF or DOCX (max 5MB)
              </p>
            </>
          )}
        </div>
      )}

      {fileUrl && (
        <div className="p-6 border rounded-lg bg-muted/50 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">Your Resume:</p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Resume
              </a>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveResume}
              disabled={loading}
            >
              Remove
            </Button>
          </div>

          <Button
            onClick={handleRecommendJobs}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              "Get Job Recommendations"
            )}
          </Button>
        </div>
      )}

      {jobs.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">
            Recommended Jobs ({jobs.length})
          </h3>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="p-4 border rounded-lg bg-background">
                <h4 className="font-medium">{job.title}</h4>
                <p className="text-sm text-muted-foreground">{job.company}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {job.relevance}% match
                  </span>
                  {job.matchedSkills && (
                    <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full">
                      {job.matchedSkills} skills matched
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm line-clamp-2">{job.description}</p>
                {job.required_skills?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">Key Skills:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.required_skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2 py-1 bg-muted rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
