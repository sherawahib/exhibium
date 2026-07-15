import media from "@/lib/projectMedia.json";

const fallback = "/projects/_retail.jpg";

export function getProjectImage(projectId: string): string {
  const map = media as Record<string, string>;
  return map[projectId] ?? fallback;
}
