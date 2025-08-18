const doNotCapitalize: Array<string> = [
  "a",
  "an",
  "the",
  "and",
  "but",
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
    .map((part: string): string => {
      if (doNotCapitalize.includes(part)) {
        return part;
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}
