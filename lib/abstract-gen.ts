import { FactionSchemaType } from "ti4-ttpg-ts-types";

import fs from "fs";
import path from "path";

export abstract class AbstractGen {
  private readonly _source: string;
  private readonly _faction: FactionSchemaType;
  private readonly _filenameToData: Map<string, Buffer> = new Map();

  /**
   * Generate output files, use addOutputFile for each file.
   *
   * Cannot mix abstract and async keywords, but treat this as abstract.
   */
  async generate(errors: Array<string>): Promise<void> {}

  constructor(source: string, faction: FactionSchemaType) {
    this._source = source;
    this._faction = faction;
  }

  addOutputFile(filename: string, data: Buffer): void {
    this._filenameToData.set(filename, data);
  }

  getSource(): string {
    return this._source;
  }

  getFaction(): FactionSchemaType {
    return this._faction;
  }

  async output(modDir: string): Promise<void> {
    if (!fs.statSync(modDir).isDirectory()) {
      throw new Error(`modDir is not a directory: ${modDir}`);
    }

    const mustStartWith: Set<string> = new Set([
      "Models",
      "Scripts",
      "Templates",
      "Textures",
    ]);

    this._filenameToData.forEach((data: Buffer, filename: string) => {
      const parts: Array<string> = filename.split("/");
      if (parts.length < 2 || !mustStartWith.has(parts[0])) {
        throw new Error(`Invalid output filename: ${filename}`);
      }
      filename = path.join(modDir, filename);
      const dir: string = path.dirname(filename);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filename, data);
    });
  }
}
