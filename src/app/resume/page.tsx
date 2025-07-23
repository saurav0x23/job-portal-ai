"use client";
import { Button } from "@/components/ui/button";
import { useJobStore } from "@/utils/store/useJobStore";
import { createClient } from "@/utils/supabase/client";
import { Loader2, UploadIcon } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadResume() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { fetchJobs } = useJobStore();

  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const supabase = createClient();

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

        try {
          const path = `resumes/${Date.now()}_${file.name}`;

          const { data, error } = await supabase.storage
            .from("resume")
            .upload(path, file, {
              cacheControl: "3600",
              upsert: true,
            });

          if (error) {
            console.error("Upload failed:", error.message);
            return;
          }

          const { data: publicUrlData } = supabase.storage
            .from("resume")
            .getPublicUrl(path);

          setFile(file);
          setFileUrl(publicUrlData?.publicUrl || null);
          console.log("Upload successful:", publicUrlData?.publicUrl);
        } catch (err) {
          console.error("Unexpected error during upload:", err);
        } finally {
          setUploading(false);
        }
      },
    });

  const handleRecommendJobs = async () => {
    if (!file) return;
    setLoading(true);
    await fetchJobs(file);
    setLoading(false);
  };

  return (
    <>
      {!file && (
        <div
          {...getRootProps()}
          className={`border-dashed border-2 rounded-lg p-8 text-center cursor-pointer transition-all ${
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

              {fileRejections.length > 0 && (
                <p className="mt-2 text-sm text-red-500">
                  {fileRejections[0].errors[0].code === "file-too-large"
                    ? "File size exceeds 5MB"
                    : "Invalid file format"}
                </p>
              )}
            </>
          )}
        </div>
      )}

      {file && (
        <div className="mt-4 p-4 border rounded-lg bg-muted space-y-4">
          <p className="text-lg font-semibold">Uploaded Resume:</p>
          <p className="text-sm text-muted-foreground">{file.name}</p>

          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 text-sm"
            >
              View Resume
            </a>
          )}

          <div className="space-x-2">
            <Button onClick={handleRecommendJobs} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recommending...
                </>
              ) : (
                "Get Recommended Jobs"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                setFileUrl(null);
              }}
            >
              Remove Resume
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
