"use client";

import { useState } from "react";
import { FileInput, FileUploader } from "@/components/ui/file-upload";
import { TrimVideo } from "@/features/video/trim";

export default function CutPage() {
  const [file, setFile] = useState<File | null>(null);

  if (!file) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
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
                {file
                  ? "다른 영상을 선택하려면 클릭 또는 드래그"
                  : "여기에 영상을 업로드하세요"}
              </span>
              <span className="text-xs">
                MP4, MOV 등 표준 영상 포맷을 지원합니다. 최대 1개의 파일을
                선택할 수 있습니다.
              </span>
            </div>
          </FileInput>
        </FileUploader>
      </div>
    );
  }
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <TrimVideo file={file} />
    </div>
  );
}
