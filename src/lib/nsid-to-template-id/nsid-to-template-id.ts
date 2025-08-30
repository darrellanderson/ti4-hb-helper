import * as fs from "fs";
import klawSync from "klaw-sync"; // walk file system
import * as path from "path";

export function nsidToTemplateId(root: string): string {
  const result: { [key: string]: string } = {};

  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory) {
    throw new Error(`missing template directory "${root}"`);
  }

  const jsonFilenames = klawSync(root, {
    filter: (item) => path.extname(item.path) === ".json",
    nodir: true,
    traverseAll: true,
  }).map((item) => item.path);

  // Restrict to templates.
  for (const jsonFilename of jsonFilenames) {
    const buffer: Buffer = fs.readFileSync(jsonFilename);
    const json: any = JSON.parse(buffer.toString());
    const templateId: string = json.GUID;
    let nsid: string = json.Metadata;

    // Reject if missing a root level key (not a template file?).
    if (typeof templateId !== "string") {
      console.log(`rejecting no GUID: "${jsonFilename}"`);
      continue;
    }
    if (typeof nsid !== "string") {
      console.log(`rejecting no metadata: "${jsonFilename}"`);
      continue;
    }

    // Include decks as a "*" named NSID.
    if (json.Type === "Card" && typeof json.CardMetadata === "object") {
      const firstNsid: string | undefined = json.CardMetadata["0"];
      if (firstNsid && firstNsid.startsWith("card.")) {
        const getPrefix = (items: Array<string>): string => {
          const first: string = items[0] ?? "";
          const firstParts: Array<string> = first.split(".");

          // Get longest dot-delimited matching type.
          let matchingPartsCount = firstParts.length;
          for (const item of items) {
            const parts: Array<string> = item.split(".");
            for (let i = 0; i < parts.length; i++) {
              if (parts[i] !== firstParts[i]) {
                matchingPartsCount = Math.min(matchingPartsCount, i);
                break;
              }
            }
          }
          const result: string = firstParts
            .slice(0, matchingPartsCount)
            .join(".");
          if (result.startsWith("card.leader")) {
            return "card.leader";
          }
          return result;
        };

        // Use a common prefix (matching to a dot-delimited string).
        const cardNsids: Array<string> = Object.values(json.CardMetadata);
        const types: Array<string> = cardNsids.map((cardNsid) => {
          const m = cardNsid.match("([^:]+):([^/]+)/.+");
          return m?.[1] ?? "";
        });
        const type = getPrefix(types);

        const sources: Array<string> = cardNsids.map((cardNsid): string => {
          const m = cardNsid.match("([^:]+):([^/]+)/.+");
          return m?.[2] ?? "";
        });
        const source = getPrefix(sources);

        const typeAndSource: string = `${type}:${source}`;
        let i = 0;
        while (result[`${typeAndSource}/${i}`]) {
          i++;
        }
        nsid = `${typeAndSource}/${i}`;
      }
    }

    if (!nsid.match("[^:]+:[^/]+/.+")) {
      // Reject metadata does not look like NSID.
      console.log(`rejecting not nsid: "${jsonFilename}" ("${nsid}")`);
      continue;
    }

    // Strip off any "|extra" part.
    const parts: Array<string> = nsid.split("|");
    const nsidBase: string | undefined = parts[0];
    if (nsidBase) {
      nsid = nsidBase;
    }

    //console.log(`accepting "${jsonFilename}: ${nsid}"`);
    result[nsid] = templateId;
  }

  const json: string = JSON.stringify(result, Object.keys(result).sort(), 2);
  const ts: string = `export const NSID_TO_TEMPLATE_ID: { [key: string]: string } = ${json};`;
  return ts;
}
