/**
 * Mobile optimization utilities
 * Helpers for detecting device capabilities and optimizing performance
 */

/**
 * Check if device is mobile (conservative check)
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  
  // Check viewport width
  if (window.innerWidth < 768) return true;
  
  // Check user agent for mobile/tablet
  const userAgent = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
};

/**
 * Check if device supports high performance graphics
 */
export const supportsHighPerformanceGraphics = (): boolean => {
  if (typeof window === "undefined") return false;
  
  // Check for low-end device indicators
  const userAgent = navigator.userAgent.toLowerCase();
  const isLowEnd = /nexus 5|nexus 6|moto g|moto x|samsung a|samsung j5/.test(userAgent);
  
  return !isLowEnd;
};

/**
 * Debounce function for scroll/resize events
 */
export const debounce = <T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit function calls
 */
export const throttle = <T extends (...args: never[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Check if Reduce Motion is preferred (accessibility)
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Determine optimal number of particles based on device
 */
export const getOptimalParticleCount = (
  desktop: number,
  mobile: number,
  tablet: number
): number => {
  if (typeof window === "undefined") return desktop;
  
  const width = window.innerWidth;
  
  if (width < 768) return mobile;
  if (width < 1024) return tablet;
  return desktop;
};
