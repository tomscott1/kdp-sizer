'use client'
import Image from "next/image";
import { ModeToggle } from "@/components/ui/dark-mode";
import { Button } from "@/components/ui/button"

export default function Home() {

  function testAPI() {
    fetch('api/python', { method: 'GET' })
        .then(response => response.json())
        .then(message => console.log(message.message))
  }

  function healthCheck() {
    fetch('api/healthcheck', { method: 'GET' })
        .then(response => response.json())
        .then(data => console.log(data))
  }

  return (
    <main className="flex">
      <ModeToggle />
      <Button
        variant="outline"
        onClick={testAPI}
      >
        Test API
      </Button>
      <Button
        variant="outline"
        onClick={healthCheck}
      >
        API Health
      </Button>
    </main>
  );
}
