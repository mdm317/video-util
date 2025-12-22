"use client";

import { useState } from "react";
import { FileInput, FileUploader } from "@/components/ui/file-upload";
import { useTranslations } from "next-intl";
import { TrimVideo } from "./_component/trim-video";

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
        <FileInput className="flex h-64 w-full items-center justify-center rounded-xl border border-dashed border-foreground/10 bg-foreground/5 text-center transition-colors hover:border-foreground/20">
          <div className="flex flex-col items-center justify-center gap-2 px-6 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
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
