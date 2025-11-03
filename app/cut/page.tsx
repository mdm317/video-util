"use client";

import { useState } from "react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import CuttingVideo from "@/features/video/cut/components/CuttingVideo";

export default function CutPage() {
  const [files, setFiles] = useState<File[] | null>(null);
  const selectedVideo = files?.[0];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <FileUploader
        value={files}
        onValueChange={setFiles}
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
              {selectedVideo ? "다른 영상을 선택하려면 클릭 또는 드래그" : "여기에 영상을 업로드하세요"}
            </span>
            <span className="text-xs">
              MP4, MOV 등 표준 영상 포맷을 지원합니다. 최대 1개의 파일을 선택할 수 있습니다.
            </span>
            {selectedVideo && (
              <span className="text-xs text-muted-foreground/80">
                현재 선택된 파일: {selectedVideo.name}
              </span>
            )}
          </div>
        </FileInput>

        {files?.length ? (
          <FileUploaderContent className="w-full">
            {files.map((file, index) => (
              <FileUploaderItem key={`${file.name}-${index}`} index={index}>
                <span className="truncate text-sm">{file.name}</span>
              </FileUploaderItem>
            ))}
          </FileUploaderContent>
        ) : null}
      </FileUploader>

      {selectedVideo ? <CuttingVideo videoFile={selectedVideo} /> : null}
    </div>
  );
}
