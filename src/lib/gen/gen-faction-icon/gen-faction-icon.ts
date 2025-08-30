import { HomebrewModuleType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen/abstract-gen";

import fs from "fs";
import path from "path";
import sharp from "sharp";

const OUTLINE_WIDTH: number = 5;

/**
 * Given a faction icon PNG (without padding), generate a 128x128 PNG
 * with transparent padding and an outline-only version of the icon.
 */
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
      const image108: Buffer = await sharp(image)
        .resize(108, 108, {
          fit: "inside",
        })
        .png()
        .toBuffer();
      const image128: Buffer = await sharp({
        create: {
          width: 128,
          height: 128,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([{ input: image108, blend: "over", left: 10, top: 10 }])
        .png()
        .toBuffer();
      const iconFilename: string = path.join(
        "Textures",
        "icon",
        "faction",
        `${nsidName}.png`
      );
      this.addOutputFile(iconFilename, image128);

      const outlineFilename: string = iconFilename.replace(
        /\.png$/,
        "-outline-only.png"
      );
      await this._outlineOnly(image128, outlineFilename);
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
