export function sanitizeTableName(name: string): string {
  // Regex allows a-z, A-Z, 0-9, _, åäöÅÄÖ
  return name.replace(/[^a-zA-Z0-9_åäöÅÄÖ]/g, "");
}
