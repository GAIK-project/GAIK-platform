/**
 * Shared utility functions for GAIK monorepo
 * Keep this simple - add common functions used across multiple apps
 */

/**
 * Format date for Finnish locale
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('fi-FI');
}

/**
 * Capitalize first letter of a string
 */
export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
