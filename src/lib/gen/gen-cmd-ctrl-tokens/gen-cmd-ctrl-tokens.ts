import { FactionSchemaType, HomebrewModuleType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen/abstract-gen";
import { getGuid } from "../../guid";
import { COMMAND_TOKEN_TEMPLATE } from "../../../data/template/command-token.template";
import { CONTROL_TOKEN_TEMPLATE } from "../../../data/template/control-token.template";

import fs from "fs";

export class GenCmdCtrlTokens extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    this._generateModels(errors);
    this.getFactions().forEach((faction: FactionSchemaType): void => {
      this._generateCommandToken(faction, errors);
      this._generateControlToken(faction, errors);
    });
  }

  _generateModels(errors: Array<string>): void {
    const models: Array<string> = ["command", "control"];
    models.forEach((model: string): void => {
      const src: string = `${__dirname}/../../../../src/data/model/${model}.obj`;
      const dst: string = `Models/token/${model}.obj`;
      if (!fs.existsSync(src)) {
        errors.push(`Model file not found: ${src}`);
      } else {
        const data: Buffer = fs.readFileSync(src);
        this.addOutputFile(dst, data);
      }
    });

    const src: string = `${__dirname}/../../../../src/data/png/token-mask.png`;
    const dst: string = `Textures/token/command-control/mask.png`;
    if (!fs.existsSync(src)) {
      errors.push(`Mask file not found: ${src}`);
    } else {
      const data: Buffer = fs.readFileSync(src);
      this.addOutputFile(dst, data);
    }
  }

  _generateCommandToken(
    faction: FactionSchemaType,
    errors: Array<string>
  ): void {
    const source: string = this.getSource();
    const nsidName = faction.nsidName;

    const prebuildDir: string = this.getPrebuildDir();
    const img: string = `${prebuildDir}/token/command-control/${nsidName}.jpg`;
    if (!fs.existsSync(img)) {
      errors.push(`Image file not found: ${img}`);
    } else {
      const imgData: Buffer = fs.readFileSync(img);
      this.addOutputFile(
        `Textures/token/command-control/${nsidName}.jpg`,
        imgData
      );
    }

    const template = JSON.parse(JSON.stringify(COMMAND_TOKEN_TEMPLATE));
    const outputFile: string = `Templates/token/command/${nsidName}.json`;

    template.GUID = getGuid(outputFile);
    template.Name = `Command (${faction.abbr})`;
    template.Metadata = `token.command:${source}/${nsidName}`;
    if (template.Models[0]) {
      template.Models[0].Texture = `token/command-control/${nsidName}.jpg`;
    }

    const templateData: Buffer = Buffer.from(
      JSON.stringify(template, null, 2),
      "utf8"
    );
    this.addOutputFile(outputFile, templateData);
  }

  _generateControlToken(
    faction: FactionSchemaType,
    _errors: Array<string>
  ): void {
    const source: string = this.getSource();
    const nsidName = faction.nsidName;

    const template = JSON.parse(JSON.stringify(CONTROL_TOKEN_TEMPLATE));
    const outputFile: string = `Templates/token/control/${nsidName}.json`;

    template.GUID = getGuid(outputFile);
    template.Name = `Control (${faction.abbr})`;
    template.Metadata = `token.control:${source}/${nsidName}`;
    if (template.Models[0]) {
      template.Models[0].Texture = `token/command-control/${nsidName}.jpg`;
    }

    const templateData: Buffer = Buffer.from(
      JSON.stringify(template, null, 2),
      "utf8"
    );
    this.addOutputFile(outputFile, templateData);
  }
}
