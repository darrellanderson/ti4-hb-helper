import {
  HomebrewModuleType,
  PlanetSchemaType,
  System,
  SystemSchemaType,
} from "ti4-ttpg-ts-types";
import { AbstractGen } from "./abstract-gen";

import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "ttpg-darrell/build/cjs/index-ext";
import { nsidNameToName } from "./nsid-name-to-name";

import fs from "fs";

export class GenFactionPromissory extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    const cards: Array<CardsheetCardType> = [];
    const source: string = this.getSource();

    this.getSystems().forEach((system: SystemSchemaType): void => {
      system.planets?.forEach((planet: PlanetSchemaType): void => {
        cards.push({
          name: nsidNameToName(planet.nsidName),
          face: `prebuild/card/planet/${planet.nsidName}.jpg`,
          metadata: `card.planet:${source}/${planet.nsidName}`,
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
      assetFilename: `Textures/card/planet/${source}.jpg`,
      templateName: `Templates/card/planet/${source}.json`,
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
