import Image from "next/image";
import { ModeToggle } from "@/components/ui/dark-mode";

export default function Home() {
  return (
    <main className="flex">
      <ModeToggle />
    </main>
  );
}
