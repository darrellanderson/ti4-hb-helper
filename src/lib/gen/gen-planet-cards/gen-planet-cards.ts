import {
  HomebrewModuleType,
  PlanetSchemaType,
  SystemSchemaType,
} from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen/abstract-gen";

import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "ttpg-darrell/build/cjs/index-ext";
import { nsidNameToName } from "../../../lib/nsid-name-to-name/nsid-name-to-name";

import fs from "fs";

export class GenFactionPromissory extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    const planetCards: Array<CardsheetCardType> = [];
    const legendaryCards: Array<CardsheetCardType> = [];
    const source: string = this.getSource();

    this.getSystems().forEach((system: SystemSchemaType): void => {
      system.planets?.forEach((planet: PlanetSchemaType): void => {
        planetCards.push({
          name: nsidNameToName(planet.nsidName),
          face: `prebuild/card/planet/${planet.nsidName}.face.jpg`,
          back: `prebuild/card/planet/${planet.nsidName}.back.jpg`,
          metadata: `card.planet:${source}/${planet.nsidName}`,
        });

        const legendaryNsidName: string | undefined = planet.legendaryNsidName;
        if (legendaryNsidName) {
          legendaryCards.push({
            name: nsidNameToName(legendaryNsidName),
            face: `prebuild/card/legendary-planet/${legendaryNsidName}.face.jpg`,
            back: `prebuild/card/legendary-planet/${legendaryNsidName}.back.jpg`,
            metadata: `card.legendary-planet:${source}/${legendaryNsidName}`,
          });
        }
      });
    });

    planetCards.forEach((card: CardsheetCardType): void => {
      if (typeof card.face === "string" && !fs.existsSync(card.face)) {
        errors.push(`Face image not found: ${card.face}`);
      }
      if (typeof card.back === "string" && !fs.existsSync(card.back)) {
        errors.push(`Back image not found: ${card.back}`);
      }
    });
    legendaryCards.forEach((card: CardsheetCardType): void => {
      if (typeof card.face === "string" && !fs.existsSync(card.face)) {
        errors.push(`Face image not found: ${card.face}`);
      }
      if (typeof card.back === "string" && !fs.existsSync(card.back)) {
        errors.push(`Back image not found: ${card.back}`);
      }
    });

    let filenameToData: {
      [key: string]: Buffer;
    };
    let createCardsheetParams: CreateCardsheetParams;

    createCardsheetParams = {
      assetFilename: `Textures/card/planet/${source}.jpg`,
      templateName: `Templates/card/planet/${source}.json`,
      cardSizePixel: { width: 500, height: 750 },
      cardSizeWorld: { width: 4.2, height: 6.3 },
      cards: planetCards,
    };
    filenameToData = await new CreateCardsheet(
      createCardsheetParams
    ).toFileData();
    for (const [filename, data] of Object.entries(filenameToData)) {
      this.addOutputFile(filename, data);
    }

    createCardsheetParams = {
      assetFilename: `Textures/card/legendary-planet/${source}.jpg`,
      templateName: `Templates/card/legendary-planet/${source}.json`,
      cardSizePixel: { width: 750, height: 500 },
      cardSizeWorld: { width: 6.3, height: 4.2 },
      cards: legendaryCards,
    };
    filenameToData = await new CreateCardsheet(
      createCardsheetParams
    ).toFileData();
    for (const [filename, data] of Object.entries(filenameToData)) {
      this.addOutputFile(filename, data);
    }
  }
}
