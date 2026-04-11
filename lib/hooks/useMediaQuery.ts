import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to detect if a media query matches
 * Solves hydration mismatch by deferring state until mount
 * Replaces redundant window.addEventListener('resize') calls across components
 * 
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 * @returns boolean indicating if the query matches (false on server, correct value on client)
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    const mq = window.matchMedia(query);
    
    // Set initial correct value
    setMatches(mq.matches);
    setHasChecked(true);

    // Create listener with proper debouncing
    let timeoutId: NodeJS.Timeout;
    const listener = (e: MediaQueryListEvent) => {
      clearTimeout(timeoutId);
      // Debounce rapid changes to prevent unnecessary re-renders
      timeoutId = setTimeout(() => {
        setMatches(e.matches);
      }, 50);
    };

    // Use addEventListener (modern approach)
    mq.addEventListener("change", listener);

    // Cleanup
    return () => {
      mq.removeEventListener("change", listener);
      clearTimeout(timeoutId);
    };
  }, [query]);

  // Return false on server to prevent hydration mismatch
  // This is safe because components using this hook should handle both states
  return hasChecked ? matches : false;
};

