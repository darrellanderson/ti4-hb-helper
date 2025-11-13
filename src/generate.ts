import { HomebrewModuleType } from "ti4-ttpg-ts";
import { GenAll } from "./lib/gen/gen-all/gen-all";
import { nsidToTemplateId } from "./lib/nsid-to-template-id/nsid-to-template-id";

import fs from "fs";
import path from "path";

export async function generate(homebrew: HomebrewModuleType): Promise<void> {
  console.log(`Generating homebrew: ${homebrew.sourceAndPackageId.source}`);

  // It would be nice to validate / parse the homebrew definition, but in
  // this context we only have a typescript .d.ts type and not the zod
  // schema.  We could export that upstream, but currently do not.

  const genAll = new GenAll(homebrew);
  const errors: Array<string> = [];
  await genAll.generate(errors);
  if (errors.length > 0) {
    console.error("Errors occurred during generation:");
    errors.forEach((error) => console.error(` - ${error}`));
    return;
  }

  await genAll.writeOutputFiles();

  const nsidToTemplateIdData: string = nsidToTemplateId(
    path.join("assets", "Templates")
  );
  fs.writeFileSync(
    path.join("src", "nsid-to-template-id.ts"),
    nsidToTemplateIdData
  );
}
