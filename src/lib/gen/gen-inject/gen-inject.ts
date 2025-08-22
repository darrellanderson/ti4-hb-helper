import { HomebrewModuleType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen";

import fs from "fs";

const HOMEBREW_DEFINITION = "prebuild/src/homebrew.ts";

/**
 * Create the inject.js file.
 *
 * We cannot use the given "homebrew" because it maybe contain
 * script items that do not serialize.  Instead, copy the homebrew
 * definition from a known location.
 */
export class GenInject extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    this._generateHomebrewFile(errors);
    this._generateInjectFile(errors);
  }

  _generateHomebrewFile(errors: Array<string>): void {
    const prebuildDir: string = this.getPrebuildDir();
    const srcFilename: string = `${prebuildDir}/src/homebrew.ts`;
    if (!fs.existsSync(srcFilename)) {
      errors.push(`Homebrew file not found: ${srcFilename}`);
      return;
    }
    const dstFilename: string = `src/homebrew.ts`;
    this.addOutputFile(dstFilename, fs.readFileSync(srcFilename));
  }

  _generateInjectFile(_errors: Array<string>): void {
    const dstFilename: string = `src/inject.ts`;
    const injectBuffer: Buffer = Buffer.from(
      `import { homebrew } from "homebrew";\nTI4.homebrewRegistry.load(homebrew);`
    );
    this.addOutputFile(dstFilename, injectBuffer);
  }
}
