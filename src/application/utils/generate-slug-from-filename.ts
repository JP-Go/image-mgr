export function generateSlugFromFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-{2,}/gi, '-')
    .replace(/^-/, '')
    .replace(/-$/, '')
    .toLowerCase();
}
