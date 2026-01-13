export function formatFileNameAsTitle(fileName: string) {
  // Remove extension
  const withoutExtension = fileName.replace(/\.[^/.]+$/, "");

  // Replace dashes/underscores and handle camelCase
  const withSpaces = withoutExtension
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2");

  // Title Case
  return withSpaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
}

export const parseSummaryToSections = (markdown: string) => {
  // Split by top-level headers (# Header)
  const sections = markdown.split(/^# /m).filter(Boolean);

  return sections.map((section) => {
    const [title, ...contentLines] = section.split("\n");
    const content = contentLines.join("\n").trim();

    return {
      title: title.trim(),
      content: content,
    };
  });
};
