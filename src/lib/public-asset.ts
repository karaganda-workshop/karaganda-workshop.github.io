/** Public file URL. Vite prefixes `BASE_URL` (`/` locally, `/workshop-karaganda/` on Pages). */
export function publicAsset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
