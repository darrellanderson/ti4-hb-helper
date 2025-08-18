import { FactionSchemaType, HomebrewModuleType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "./abstract-gen";

import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "../../node_modules/ttpg-darrell/build/cjs/index-ext";
import { nsidNameToName } from "./nsid-name-to-name";

import fs from "fs";

export class GenFactionPromissory extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    const cards: Array<CardsheetCardType> = [];
    const source: string = this.getSource();

    const backSrc: string = `${__dirname}/../data/promissory.back.jpg`;
    const backDst: string = `Textures/card/promissory/${source}.back.jpg`;
    if (!fs.existsSync(backSrc)) {
      throw new Error(`Promissory back image not found: ${backSrc}`);
    }
    fs.cpSync(backSrc, backDst);

    this.getFactions().forEach((faction: FactionSchemaType): void => {
      faction.promissories.forEach((cardNsidName: string): void => {
        cards.push({
          name: nsidNameToName(cardNsidName),
          face: `prebuild/card/promissory/${cardNsidName}.jpg`,
          metadata: `card.promissory:${source}/${cardNsidName}`,
        });
      });
    });

    cards.forEach((card: CardsheetCardType): void => {
      if (typeof card.face === "string" && !fs.existsSync(card.face)) {
        errors.push(`Face image not found: ${card.face}`);
      }
      if (typeof card.back === "string" && !fs.existsSync(card.back)) {
        errors.push(`Back image not found: ${card.back}`);
      }
    });

    const createCardsheetParams: CreateCardsheetParams = {
      assetFilename: `Textures/card/promissory/${source}.jpg`,
      templateName: `Templates/card/promissory/${source}.json`,
      cardSizePixel: { width: 500, height: 750 },
      cardSizeWorld: { width: 4.2, height: 6.3 },
      cards,
    };

    const filenameToData: {
      [key: string]: Buffer<ArrayBufferLike>;
    } = await new CreateCardsheet(createCardsheetParams).toFileData();
    for (const [filename, data] of Object.entries(filenameToData)) {
      this.addOutputFile(filename, data);
    }
  }
}
