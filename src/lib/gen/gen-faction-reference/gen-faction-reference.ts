import { FactionSchemaType, HomebrewModuleType } from "ti4-ttpg-ts";
import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "ttpg-darrell/build/cjs/index-ext";
import { AbstractGen } from "../abstract-gen/abstract-gen";

import fs from "fs";

export class GenFactionReference extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    const cards: Array<CardsheetCardType> = [];
    const source: string = this.getSource();

    const prebuildDir: string = this.getPrebuildDir();
    const back: string = `${prebuildDir}/card/faction-reference/faction-reference.back.jpg`;
    fs.cpSync(
      `${__dirname}/../../../../src/data/jpg/faction-reference.back.jpg`,
      back
    );

    this.getFactions().forEach((faction: FactionSchemaType): void => {
      if (!faction.skipFactionReferenceCard) {
        cards.push({
          name: faction.name,
          face: `${prebuildDir}/card/faction-reference/${faction.nsidName}.jpg`,
          metadata: `card.faction-reference:${source}/${faction.nsidName}`,
        });
      }
    });

    let missingCard: boolean = false;
    cards.forEach((card: CardsheetCardType): void => {
      if (typeof card.face === "string" && !fs.existsSync(card.face)) {
        errors.push(`Face image not found: ${card.face}`);
        missingCard = true;
      }
    });
    if (missingCard) {
      return;
    }

    const createCardsheetParams: CreateCardsheetParams = {
      assetFilename: `card/faction-reference/${source}`,
      templateName: "Faction Reference",
      cardSizePixel: { width: 969, height: 682 },
      cardSizeWorld: { width: 8.8, height: 6.3 },
      cards,
      back,
    };
    const filenameToData: {
      [key: string]: Buffer;
    } = await new CreateCardsheet(createCardsheetParams).toFileData();
    for (const [filename, data] of Object.entries(filenameToData)) {
      this.addOutputFile(filename, data);
    }
  }
}
