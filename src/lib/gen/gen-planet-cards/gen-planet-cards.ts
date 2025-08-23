import {
  HomebrewModuleType,
  PlanetSchemaType,
  SystemSchemaType,
} from "ti4-ttpg-ts-types";
import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "ttpg-darrell/build/cjs/index-ext";
import { AbstractGen } from "../abstract-gen/abstract-gen";
import { nsidNameToName } from "../../../lib/nsid-name-to-name/nsid-name-to-name";

import fs from "fs";

export class GenPlanetCards extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    const planetCards: Array<CardsheetCardType> = [];
    const legendaryCards: Array<CardsheetCardType> = [];
    const source: string = this.getSource();

    const prebuildDir: string = this.getPrebuildDir();
    this.getSystems().forEach((system: SystemSchemaType): void => {
      system.planets?.forEach((planet: PlanetSchemaType): void => {
        planetCards.push({
          name: nsidNameToName(planet.nsidName),
          face: `${prebuildDir}/card/planet/${planet.nsidName}.face.jpg`,
          back: `${prebuildDir}/card/planet/${planet.nsidName}.back.jpg`,
          metadata: `card.planet:${source}/${planet.nsidName}`,
        });

        const legendaryNsidName: string | undefined = planet.legendaryNsidName;
        if (legendaryNsidName) {
          legendaryCards.push({
            name: nsidNameToName(legendaryNsidName),
            face: `${prebuildDir}/card/legendary-planet/${legendaryNsidName}.face.jpg`,
            back: `${prebuildDir}/card/legendary-planet/${legendaryNsidName}.back.jpg`,
            metadata: `card.legendary-planet:${source}/${legendaryNsidName}`,
          });
        }
      });
    });

    let missingCard: boolean = false;
    planetCards.forEach((card: CardsheetCardType): void => {
      if (typeof card.face === "string" && !fs.existsSync(card.face)) {
        errors.push(`Face image not found: ${card.face}`);
        missingCard = true;
      }
      if (typeof card.back === "string" && !fs.existsSync(card.back)) {
        errors.push(`Back image not found: ${card.back}`);
        missingCard = true;
      }
    });
    legendaryCards.forEach((card: CardsheetCardType): void => {
      if (typeof card.face === "string" && !fs.existsSync(card.face)) {
        errors.push(`Face image not found: ${card.face}`);
        missingCard = true;
      }
      if (typeof card.back === "string" && !fs.existsSync(card.back)) {
        errors.push(`Back image not found: ${card.back}`);
        missingCard = true;
      }
    });
    if (missingCard) {
      return;
    }

    let filenameToData: {
      [key: string]: Buffer;
    };
    let createCardsheetParams: CreateCardsheetParams;

    createCardsheetParams = {
      assetFilename: `card/planet/${source}`,
      templateName: `card/planet/${source}.json`,
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
      assetFilename: `card/legendary-planet/${source}`,
      templateName: `card/legendary-planet/${source}.json`,
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
