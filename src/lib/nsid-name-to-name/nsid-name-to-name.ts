const doNotCapitalize: Array<string> = [
  "a",
  "an",
  "the",
  "and",
  "but",
  "of",
  "or",
  "for",
  "nor",
  "on",
  "at",
  "to",
  "by",
];

export function nsidNameToName(nsidName: string): string {
  return nsidName
    .split("-")
    .map((part: string, index: number): string => {
      if (index > 0 && doNotCapitalize.includes(part)) {
        return part;
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}
