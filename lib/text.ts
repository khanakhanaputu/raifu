const TITLE_PATTERN = /dr\.|Sp\.GK/g;

export function initials(name: string, { stripTitles = false } = {}) {
  return (stripTitles ? name.replace(TITLE_PATTERN, "") : name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
