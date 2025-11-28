"use client";

import { useState } from "react";
import { FileInput, FileUploader } from "@/components/ui/file-upload";
import { TrimVideo } from "@/features/video/trim";
import { useTranslations } from "next-intl";

export default function CutPage() {
  const [file, setFile] = useState<File | null>(null);
  const uploadT = useTranslations("Trim.upload");

  if (!file) {
    return (
      <FileUploader
        value={[]}
        onValueChange={(files) => {
          if (files) {
            setFile(files[0]);
          }
        }}
        dropzoneOptions={{
          accept: {
            "video/*": [],
          },
          maxFiles: 1,
          multiple: false,
        }}
        reSelect
        className="flex flex-col gap-3"
      >
        <FileInput className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 bg-muted/30 text-center transition-colors hover:border-muted-foreground/80">
          <div className="flex flex-col items-center justify-center gap-2 px-6 text-sm text-muted-foreground">
            <span className="font-medium text-primary">
              {file ? uploadT("replace") : uploadT("cta")}
            </span>
            <span className="text-xs text-foreground/70">
              {uploadT("helper")}
            </span>
          </div>
        </FileInput>
      </FileUploader>
    );
  }
  return <TrimVideo file={file} />;
}
