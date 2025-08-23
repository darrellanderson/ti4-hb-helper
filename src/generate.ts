import { HomebrewModuleType } from "ti4-ttpg-ts-types";
import { GenAll } from "./lib/gen/gen-all/gen-all";

export async function generate(homebrew: HomebrewModuleType): Promise<void> {
  console.log(`Generating homebrew: ${homebrew.sourceAndPackageId.source}`);

  const genAll = new GenAll(homebrew);
  const errors: Array<string> = [];
  await genAll.generate(errors);
  if (errors.length > 0) {
    console.error("Errors occurred during generation:");
    errors.forEach((error) => console.error(` - ${error}`));
    return;
  }

  genAll.writeOutputFiles();
}
