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
        const slashIndex: number = firstNsid.indexOf("/");
        const typeAndSource: string = firstNsid.substring(0, slashIndex);
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
