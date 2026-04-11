import crypto from "crypto";

// In-memory store for CSRF tokens (for development)
// For production, store in Redis or database with expiration
const csrfTokenStore = new Set<string>();

/**
 * Generate a secure CSRF token
 * @returns CSRF token string
 */
export function generateCSRFToken(): string {
  const token = crypto.randomBytes(32).toString("hex");
  csrfTokenStore.add(token);
  
  // Auto-expire token after 60 minutes
  setTimeout(() => {
    csrfTokenStore.delete(token);
  }, 3600000);
  
  return token;
}

/**
 * Verify a CSRF token
 * @param token - Token to verify
 * @returns boolean - true if token is valid
 */
export function verifyCSRFToken(token: string): boolean {
  const isValid = csrfTokenStore.has(token);
  if (isValid) {
    // Consume token (one-time use)
    csrfTokenStore.delete(token);
  }
  return isValid;
}
