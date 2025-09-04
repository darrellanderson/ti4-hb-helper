import { HomebrewModuleType } from "ti4-ttpg-ts";
import { AbstractGen } from "../../gen/abstract-gen/abstract-gen";
import { STRATEGY_CARD_TEMPLATE } from "../../../data/template/strategy-card.template";
import { nsidNameToName } from "../../nsid-name-to-name";
import { getGuid } from "../../guid";

import fs from "fs";

export class GenExtStrategyCard extends AbstractGen {
  private _strategyCardName: string = "";

  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  setStrategyCardName(name: string): this {
    this._strategyCardName = name;
    return this;
  }

  async generate(errors: Array<string>): Promise<void> {
    if (this._strategyCardName === "") {
      errors.push("Strategy card name is not set.");
      return;
    }

    const model: string = `${__dirname}/../../../../src/data/model/strategy-card.obj`;
    if (!fs.existsSync(model) || !fs.lstatSync(model).isFile()) {
      throw new Error("strategy card model missing");
    }
    const modelData: Buffer = fs.readFileSync(model);
    this.addOutputFile("Models/tile/strategy-card.obj", modelData);

    const prebuildDir: string = this.getPrebuildDir();
    const img: string = `${prebuildDir}/strategy-card/${this._strategyCardName}.png`;
    if (!fs.existsSync(img) || !fs.lstatSync(img).isFile()) {
      errors.push(`strategy card image missing "${img}"`);
      return;
    }
    const imgData: Buffer = fs.readFileSync(img);
    this.addOutputFile(
      `Textures/tile/strategy-card/${this._strategyCardName}.png`,
      imgData
    );

    const template = JSON.parse(JSON.stringify(STRATEGY_CARD_TEMPLATE));
    const templateName: string = `Templates/tile/strategy-card/${this._strategyCardName}.json`;

    template.Name = nsidNameToName(this._strategyCardName);
    template.GUID = getGuid(templateName);
    template.Metadata = `tile.strategy-card:${this.getSource()}/${
      this._strategyCardName
    }`;
    if (template.Models[0]) {
      template.Models[0].Texture = `tile/strategy-card/${this._strategyCardName}.png`;
    }

    const templateData: Buffer = Buffer.from(JSON.stringify(template, null, 2));
    this.addOutputFile(templateName, templateData);
  }
}
