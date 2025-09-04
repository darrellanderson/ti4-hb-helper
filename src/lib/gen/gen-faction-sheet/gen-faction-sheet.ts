import { FactionSchemaType, HomebrewModuleType } from "ti4-ttpg-ts";
import { AbstractGen } from "../abstract-gen/abstract-gen";
import { getGuid } from "../../../lib/guid/guid";
import { FACTION_SHEET_TEMPLATE } from "../../../data/template/faction-sheet.template";
import fs from "fs";
import sharp from "sharp";

export class GenFactionSheet extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    for (const faction of this.getFactions()) {
      await this._generateOne(faction, errors);
    }
  }

  async _generateOne(
    faction: FactionSchemaType,
    errors: Array<string>
  ): Promise<void> {
    const source: string = this.getSource();
    const nsidName: string = faction.nsidName;

    const template = JSON.parse(JSON.stringify(FACTION_SHEET_TEMPLATE)); // copy
    const templateFilename: string = `Templates/faction-sheet/${faction.nsidName}.json`;

    template.GUID = getGuid(templateFilename);
    template.Name = faction.abbr;
    template.CardNames["0"] = template.Name;
    template.Metadata = `sheet.faction:${source}/${nsidName}`;
    template.CardMetadata["0"] = template.Metadata;

    // For dumb historical reasons, the face/back images are swapped.
    template.FrontTexture = `faction-sheet/${nsidName}.back.jpg`;
    template.BackTexture = `faction-sheet/${nsidName}.face.jpg`;

    const buffer: Buffer = Buffer.from(JSON.stringify(template), "utf-8");
    this.addOutputFile(templateFilename, buffer);

    const prebuildDir: string = this.getPrebuildDir();
    const srcFace = `${prebuildDir}/faction-sheet/${nsidName}.face.jpg`;
    const srcBack = `${prebuildDir}/faction-sheet/${nsidName}.back.jpg`;
    const dstFace = `Textures/faction-sheet/${nsidName}.face.jpg`;
    const dstBack = `Textures/faction-sheet/${nsidName}.back.jpg`;

    if (!fs.existsSync(srcFace)) {
      errors.push(`Source face image not found: ${srcFace}`);
    } else {
      const outFace: Buffer = await sharp(srcFace)
        .resize(2048, 1380)
        .jpeg({ quality: 90 })
        .toBuffer();
      this.addOutputFile(dstFace, outFace);
    }

    if (!fs.existsSync(srcBack)) {
      errors.push(`Source back image not found: ${srcBack}`);
    } else {
      const outBack: Buffer = await sharp(srcBack)
        .resize(2048, 1380)
        .jpeg({ quality: 90 })
        .toBuffer();
      this.addOutputFile(dstBack, outBack);
    }
  }
}
