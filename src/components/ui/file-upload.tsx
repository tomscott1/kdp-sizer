"use client";

import { useState } from "react";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/extension/file-upload";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

import handleProcess from "@/lib/process";

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
      <p className="text-xs text-gray-500 dark:text-gray-400">
        PDF
      </p>
    </>
  );
};

const FileUploaderComponent = () => {
  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
    accept: {
      "application/pdf": [".pdf"],
    },
  };

  const pollUploadStatus = async () => {
    try {
      const response = await axios.get('/api/upload-status');
      console.log('Upload status:', response.data);
      if (response.data.status === 'completed' || response.data.status === 'error') {
        clearInterval(statusInterval);
      }
    } catch (error) {
      console.error('Error fetching upload status:', error);
      clearInterval(statusInterval);
    }
  };

  let statusInterval: NodeJS.Timeout;

  const handleUploadClick = async () => {
    if (files && files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      try {
        statusInterval = setInterval(pollUploadStatus, 100); // Poll every second
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Files uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading files:', error);
        clearInterval(statusInterval);
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
            <Button
              variant="outline"
              onClick={handleUploadClick}
            >
              Process
            </Button>
          )}
      </div>
    </div>


  );
};

export default FileUploaderComponent;
