import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Retrieves the authentication token from localStorage or sessionStorage.
 * @returns The token string if found, otherwise null.
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};
