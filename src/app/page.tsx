'use client'
import Navbar from "@/components/ui/navbar";
import { ModeToggle } from "@/components/ui/dark-mode";
import { Button } from "@/components/ui/button"
import FileUploadDropzone from "@/components/ui/file-upload"; 

export default function Home() {



  return (
    <main>
      <Navbar />
      <div className="flex justify-center">
        <div className="w-1/2">
          <FileUploadDropzone />
        </div>
      </div>
    </main>
  );
}


