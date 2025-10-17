import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatRelative = (iso: string): string => {
    if (!iso) return "";
    const date = new Date(iso);
    if (isNaN(date.getTime())) return "";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const sec = Math.floor(diffMs / 1000);
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}min`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h`;
    const day = Math.floor(hr / 24);
    if (day < 7) return `${day}d`;
    const week = Math.floor(day / 7);
    if (week < 5) return `${week}w`;
    const month = Math.floor(day / 30); // approximate
    if (month < 12) return `${month}mo`;
    const year = Math.floor(day / 365); // approximate
    return `${year}y`;
  };


  export const formatTime = (value?: string | null) => {
    if (!value) return '';
    try {
      const date = new Date(value);
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      }).format(date);
    } catch (error) {
      return '';
    }
  };
  
  export const formatEditedTime = (createdAt: string, updatedAt: string) => {
    if (!updatedAt || updatedAt === createdAt) return null;
    try {
      const updated = new Date(updatedAt);
      const time = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      }).format(updated);
      return `edited ${time}`;
    } catch (error) {
      return 'edited';
    }
  };
  

  export   const formatBio = (rawBio: string | null) => {
      if (!rawBio) {
        return "No bio yet";
      }
      const trimmed = rawBio.trim();
      if (trimmed.length <= 15) {
        return trimmed;
      }
      return `${trimmed.slice(0, 15)}...`;
    };