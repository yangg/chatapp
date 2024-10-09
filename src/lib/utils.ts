import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getInitials(name: string) {
  if (!name) return '';
  return name.split(' ').slice(0, 2).map(n => n.charAt(0)).join('');
}

