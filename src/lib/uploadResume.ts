"use client";
import { useJobStore } from "@/utils/store/useJobStore";
import { useDropzone } from "react-dropzone";

export function UploadResume() {
  const { fetchJobs, loading } = useJobStore();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    onDrop: (acceptedFiles) => fetchJobs(acceptedFiles[0]),
  });

  return (
    <div
      {...getRootProps()}
      className="border-dashed border-2 rounded-lg p-8 text-center"
    >
      <input {...getInputProps()} />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <UploadIcon className="mx-auto h-12 w-12" />
          <p>Drag & drop your resume</p>
          <p className="text-sm text-muted-foreground">
            PDF, DOC, or DOCX (max 5MB)
          </p>
        </>
      )}
    </div>
  );
}
