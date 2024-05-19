'use client'
import { ModeToggle } from "@/components/ui/dark-mode";
import { Button } from "@/components/ui/button"
import FileUploadDropzone from "@/components/ui/file-upload"; 

export default function Home() {

  function healthCheck() {
    fetch('api/healthcheck', { method: 'GET' })
        .then(response => response.json())
        .then(data => console.log(data))
  }

  return (
    <main className="flex grid grid-rows-2">
      <div className="row-span-6">
        <div>
          <ModeToggle />
        </div>
        <div>
        <Button
          variant="outline"
          onClick={healthCheck}
        >
          API Health
        </Button>
        </div>
      </div>
      <div className="row-span-8">
        <div>
          <FileUploadDropzone />
        </div>
      </div>
      <div className="row-span-10">

      </div>
    </main>
  );
}


