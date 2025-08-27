import { HomebrewModuleType } from "ti4-ttpg-ts-types";
import { GenAll } from "./lib/gen/gen-all/gen-all";
import { nsidToTemplateId } from "./lib/nsid-to-template-id/nsid-to-template-id";

import fs from "fs";

export async function generate(homebrew: HomebrewModuleType): Promise<void> {
  console.log(`Generating homebrew: ${homebrew.sourceAndPackageId.source}`);

  // Adding this breaks things?
  // "Cannot find module 'ti4-ttpg-ts-types' from 'src/generate.ts'""
  //validateHomebrewModule(homebrew);

  const genAll = new GenAll(homebrew);
  const errors: Array<string> = [];
  await genAll.generate(errors);
  if (errors.length > 0) {
    console.error("Errors occurred during generation:");
    errors.forEach((error) => console.error(` - ${error}`));
    return;
  }

  genAll.writeOutputFiles();

  const nsidToTemplateIdData: string = nsidToTemplateId("assets/Templates");
  fs.writeFileSync("src/nsid-to-template-id.ts", nsidToTemplateIdData);
}
