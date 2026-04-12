import { useSyncExternalStore } from "react";

/**
 * Custom hook to detect if a media query matches
 * Solves hydration mismatch by deferring state until mount
 * Replaces redundant window.addEventListener('resize') calls across components
 * 
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 * @returns boolean indicating if the query matches (false on server, correct value on client)
 */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") return () => {};

    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener("change", callback);

    return () => mediaQuery.removeEventListener("change", callback);
  };

  const getSnapshot = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  };

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};

