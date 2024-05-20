import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function healthCheck() {
  fetch('api/healthcheck', { method: 'GET' })
      .then(response => response.json())
      .then(data => console.log(data))
}