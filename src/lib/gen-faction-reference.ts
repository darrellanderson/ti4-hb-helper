import { FactionSchemaType, HomebrewModuleType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "./abstract-gen";

import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "ttpg-darrell/build/cjs/index-ext";
import { nsidNameToName } from "./nsid-name-to-name";

import fs from "fs";

export class GenFactionReference extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    const cards: Array<CardsheetCardType> = [];
    const source: string = this.getSource();

    this.getFactions().forEach((faction: FactionSchemaType): void => {
      cards.push({
        name: faction.name,
        face: `prebuild/card/faction-reference/${faction.nsidName}.jpg`,
      });
    });

    cards.forEach((card: CardsheetCardType): void => {
      if (typeof card.face === "string" && !fs.existsSync(card.face)) {
        errors.push(`Face image not found: ${card.face}`);
      }
    });

    const createCardsheetParams: CreateCardsheetParams = {
      assetFilename: `Textures/card/leader/${source}.jpg`,
      templateName: `Templates/card/leader/${source}.json`,
      cardSizePixel: { width: 750, height: 500 },
      cardSizeWorld: { width: 6.3, height: 4.2 },
      cards,
      back: `${__dirname}/../data/faction-reference.back.jpg`,
    };
    const filenameToData: {
      [key: string]: Buffer<ArrayBufferLike>;
    } = await new CreateCardsheet(createCardsheetParams).toFileData();
    for (const [filename, data] of Object.entries(filenameToData)) {
      this.addOutputFile(filename, data);
    }
  }
}
