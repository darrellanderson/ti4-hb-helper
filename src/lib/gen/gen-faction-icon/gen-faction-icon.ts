import { HomebrewModuleType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen/abstract-gen";

import fs from "fs";
import path from "path";
import sharp from "sharp";

const OUTLINE_WIDTH: number = 5;

export class GenFactionIcon extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    const prebuildDir: string = this.getPrebuildDir();
    for (const faction of this.getFactions()) {
      const nsidName: string = faction.nsidName;

      const image: string = path.join(
        prebuildDir,
        "icon",
        "faction",
        `${nsidName}.png`
      );
      if (!fs.existsSync(image)) {
        errors.push(`GenFactionIcon: faction icon image not found: ${image}`);
        continue;
      }
      const imageData: Buffer = fs.readFileSync(image);
      const iconFilename: string = path.join(
        "Textures",
        "icon",
        "faction",
        `${nsidName}.png`
      );
      this.addOutputFile(iconFilename, imageData);

      const outlineFilename: string = iconFilename.replace(
        /\.png$/,
        "-outline-only.png"
      );
      await this._outlineOnly(imageData, outlineFilename);
    }
  }

  async _outlineOnly(image: Buffer, outlineFilename: string): Promise<void> {
    // White opaque area, black background.
    const inner: Buffer = await sharp(image)
      .ensureAlpha()
      .extractChannel("alpha")
      .toBuffer();

    // White opaque + outline, black outer background.
    // Need two steps to remove blurred alpha.
    const blurredInnerMask: Buffer = await sharp(inner)
      .blur(OUTLINE_WIDTH)
      .flatten(true)
      .toColorspace("b-w")
      .toBuffer();
    const outerMask: Buffer = await sharp(blurredInnerMask)
      .threshold(1)
      .unflatten()
      .negate()
      .extractChannel("alpha")
      .png()
      .toBuffer();

    const outlineData: Buffer = await sharp(outerMask)
      .unflatten()
      .composite([{ input: image, blend: "multiply" }])
      .negate()
      .png()
      .toBuffer();
    this.addOutputFile(outlineFilename, outlineData);
  }
}
