import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Re-export date utilities for convenience
export * from './utils/date-utils';

// Re-export PDF export utilities
export * from './utils/pdf-export';