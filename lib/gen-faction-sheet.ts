import { AbstractGen } from "./abstract-gen";
import { FactionSchemaType } from "ti4-ttpg-ts-types";
import { getGuid } from "./guid";
import { FACTION_SHEET_TEMPLATE } from "../data/faction-sheet.template";

import fs from "fs";
import sharp from "sharp";

export class GenFactionSheet extends AbstractGen {
  private readonly _template;
  private readonly _templateFilename: string;

  constructor(source: string, faction: FactionSchemaType) {
    super(source, faction);

    this._template = JSON.parse(JSON.stringify(FACTION_SHEET_TEMPLATE)); // copy
    this._templateFilename = `Templates/faction-sheet/${faction.nsidName}.json`;

    this._setGuid()._setName()._setNsid()._setTextures();
  }

  _getTemplateData(): string {
    return JSON.stringify(this._template);
  }

  _setGuid(): this {
    this._template.GUID = getGuid(this._templateFilename);
    return this;
  }

  _setName(): this {
    this._template.Name = this.getFaction().abbr;
    this._template.CardNames["0"] = this._template.Name;
    return this;
  }

  _setNsid(): this {
    const source: string = this.getSource();
    const nsidName: string = this.getFaction().nsidName;
    this._template.Metadata = `sheet.faction:${source}/${nsidName}`;
    this._template.CardMetadata["0"] = this._template.Metadata;
    return this;
  }

  _setTextures(): this {
    const nsidName: string = this.getFaction().nsidName;
    this._template.FrontTexture = `faction-sheet/${nsidName}.face.jpg`;
    this._template.BackTexture = `faction-sheet/${nsidName}.back.jpg`;
    return this;
  }

  async generate(errors: Array<string>): Promise<void> {
    const buffer: Buffer = Buffer.from(this._getTemplateData(), "utf-8");
    this.addOutputFile(this._templateFilename, buffer);

    const nsidName: string = this.getFaction().nsidName;
    const srcFace = `prebuild/faction-sheet/${nsidName}.face.jpg`;
    const srcBack = `prebuild/faction-sheet/${nsidName}.back.jpg`;
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
