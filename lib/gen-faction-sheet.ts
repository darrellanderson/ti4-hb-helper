import { FactionSchemaType } from "ti4-ttpg-ts-types";
import { getGuid } from "./guid";
import { FACTION_SHEET_TEMPLATE } from "../data/faction-sheet.template";

import fs from "fs";
import sharp from "sharp";

export class GenFactionSheet {
  private readonly _source: string;
  private readonly _faction: FactionSchemaType;

  private readonly _template;
  private readonly _templateFilename: string;

  constructor(source: string, faction: FactionSchemaType) {
    this._source = source;
    this._faction = faction;

    this._template = JSON.parse(JSON.stringify(FACTION_SHEET_TEMPLATE));
    this._templateFilename = `assets/Templates/faction-sheet/${faction.nsidName}.json`;

    this._setGuid()._setName()._setNsid()._setTextures();
  }

  _getFactionSheetSrcFace(): string {
    return `prebuild/faction-sheet/${this._faction.nsidName}.face.jpg`;
  }

  _getFactionSheetSrcBack(): string {
    return `prebuild/faction-sheet/${this._faction.nsidName}.back.jpg`;
  }

  _getFactionSheetDstFace(): string {
    return `assets/Textures/faction-sheet/${this._faction.nsidName}.face.jpg`;
  }

  _getFactionSheetDstBack(): string {
    return `assets/Textures/faction-sheet/${this._faction.nsidName}.back.jpg`;
  }

  _getTemplateData(): string {
    return JSON.stringify(this._template);
  }

  _setGuid(): this {
    this._template.GUID = getGuid(this._templateFilename);
    return this;
  }

  _setName(): this {
    this._template.Name = this._faction.abbr;
    this._template.CardNames["0"] = this._template.Name;
    return this;
  }

  _setNsid(): this {
    this._template.Metadata = `sheet.faction:${this._source}/${this._faction.nsidName}`;
    this._template.CardMetadata["0"] = this._template.Metadata;
    return this;
  }

  _setTextures(): this {
    this._template.FrontTexture = `faction-sheet/${this._faction.nsidName}.face.jpg`;
    this._template.BackTexture = `faction-sheet/${this._faction.nsidName}.back.jpg`;
    return this;
  }

  validate(errors: Array<string>): boolean {
    const srcFace = this._getFactionSheetSrcFace();
    const srcBack = this._getFactionSheetSrcBack();

    if (!fs.existsSync(srcFace)) {
      errors.push(`Source face image not found: ${srcFace}`);
    }
    if (!fs.existsSync(srcBack)) {
      errors.push(`Source back image not found: ${srcBack}`);
    }
    return errors.length === 0;
  }

  generate(): void {
    const buffer: Buffer = new Buffer(this._getTemplateData());
    fs.writeFileSync(this._templateFilename, buffer);

    const srcFace = this._getFactionSheetSrcFace();
    const srcBack = this._getFactionSheetSrcBack();
    const dstFace = this._getFactionSheetDstFace();
    const dstBack = this._getFactionSheetDstBack();

    sharp(srcFace).resize(2048, 1380).toFile(dstFace);
    sharp(srcBack).resize(2048, 1380).toFile(dstBack);
  }
}
