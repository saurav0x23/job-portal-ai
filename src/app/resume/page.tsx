"use client";
import { JobsGrid } from "@/components/JobsGrid";
import ResumeAnalyzerLoader from "@/components/ResumeAnalyzerLoader";
import { Button } from "@/components/ui/button";
import { useJobStore } from "@/utils/store/useJobStore";
import { createClient } from "@/utils/supabase/client";
import {
  UploadIcon,
  FileText,
  Trash2,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
      } catch (err: any) {
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
      toast.error("Please try again. Failed to get job recommendations");
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
      <div className="flex flex-col items-center justify-center space-y-4 min-h-[400px] ">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-muted rounded-full"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          Checking your resume...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Upload Your Resume
        </h1>
        <p className="text-muted-foreground">
          Get personalized job recommendations based on your experience
        </p>
      </div>

      {/* Upload Section */}
      <div className="flex flex-col items-center justify-center">
        {!fileUrl && (
          <div className="space-y-4 max-w-4xl">
            <div
              {...getRootProps()}
              className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200 ${
                isDragActive
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-muted-foreground/25 hover:border-muted-foreground/40"
              } ${
                uploading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <input {...getInputProps()} />
              <div className="p-12 text-center">
                {uploading ? (
                  <div className="space-y-4">
                    <div className="relative mx-auto w-12 h-12">
                      <div className="absolute inset-0 w-12 h-12 border-4 border-muted rounded-full"></div>
                      <div className="absolute inset-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Uploading your resume...</p>
                      <p className="text-sm text-muted-foreground">
                        This may take a few moments
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-2xl">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                      <UploadIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">
                        {isDragActive
                          ? "Drop your resume here"
                          : "Drag & drop your resume"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or <span className="text-primary">browse files</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <span>PDF or DOCX</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <span>Max 5MB</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resume Preview Section */}
        {fileUrl && (
          <div className="space-y-6 w-xl">
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-start justify-between space-x-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-sm">Resume uploaded</p>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      <span>View document</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveResume}
                  disabled={loading}
                  className="flex-shrink-0 h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleRecommendJobs}
              disabled={loading}
              size="lg"
              className="w-full h-12 text-base font-medium"
            >
              {loading ? <ResumeAnalyzerLoader /> : "Get Job Recommendations"}
            </Button>
          </div>
        )}
      </div>

      {/* Jobs Section */}
      {jobs.length > 0 && (
        <div className="space-y-6 min-h-screen">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Recommended Jobs</h2>
              <p className="text-sm text-muted-foreground">
                Found {jobs.length} job{jobs.length !== 1 ? "s" : ""} matching
                your profile
              </p>
            </div>
          </div>
          <JobsGrid jobs={jobs} />
        </div>
      )}
    </div>
  );
}
