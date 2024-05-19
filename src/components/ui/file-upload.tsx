"use client";

import { useState, useRef } from "react";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/extension/file-upload";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">PDF</p>
    </>
  );
};

const FileUploaderComponent = () => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [blobUrls, setBlobUrls] = useState<PutBlobResult[]>([]);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
    accept: {
      "application/pdf": [".pdf"],
    },
  };

  const handleUploadClick = async () => {
    if (files && files.length > 0) {
      try {
        const newBlobUrls: PutBlobResult[] = [];

        for (const file of files) {
          const newBlob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/input-file-upload', // This should match route
          });

          newBlobUrls.push(newBlob);
        }

        setBlobUrls(newBlobUrls);
        console.log('Files uploaded successfully:', newBlobUrls);
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }
  };

  return (
    <div>
      <FileUploader
        value={files}
        onValueChange={setFiles}
        dropzoneOptions={dropZoneConfig}
        className="relative bg-background rounded-lg p-2"
      >
        <FileInput className="outline-dashed outline-1 outline-white">
          <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
            <FileSvgDraw />
          </div>
        </FileInput>
        <FileUploaderContent>
          {files &&
            files.length > 0 &&
            files.map((file, i) => (
              <FileUploaderItem key={i} index={i}>
                <Paperclip className="h-4 w-4 stroke-current" />
                <span>{file.name}</span>
              </FileUploaderItem>
            ))}
        </FileUploaderContent>
      </FileUploader>
      <div>
        {files && files.length > 0 && (
          <Button variant="outline" onClick={handleUploadClick}>
            Upload
          </Button>
        )}
      </div>
      {blobUrls.length > 0 && (
        <div className="mt-4">
          {blobUrls.map((blob, index) => (
            <div key={index}>
              Blob URL: <a href={blob.url} target="_blank" rel="noopener noreferrer">{blob.url}</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploaderComponent;
