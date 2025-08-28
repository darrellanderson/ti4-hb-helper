import { FactionSchemaType, HomebrewModuleType } from "ti4-ttpg-ts-types";
import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "ttpg-darrell/build/cjs/index-ext";
import { AbstractGen } from "../abstract-gen/abstract-gen";
import { nsidNameToName } from "../../../lib/nsid-name-to-name/nsid-name-to-name";

import fs from "fs";

export class GenFactionBreakthrough extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    const cards: Array<CardsheetCardType> = [];
    const source: string = this.getSource();

    const prebuildDir: string = this.getPrebuildDir();

    this.getFactions().forEach((faction: FactionSchemaType): void => {
      faction.breakthroughs?.forEach((cardNsidName: string): void => {
        cards.push({
          name: nsidNameToName(cardNsidName),
          face: `${prebuildDir}/card/breakthrough/${cardNsidName}.face.jpg`,
          back: `${prebuildDir}/card/breakthrough/${cardNsidName}.back.jpg`,
          metadata: `card.breakthrough:${source}/${cardNsidName}`,
        });
      });
    });

    let missingCard: boolean = false;
    cards.forEach((card: CardsheetCardType): void => {
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

    const createCardsheetParams: CreateCardsheetParams = {
      assetFilename: `card/breakthrough/${source}`,
      templateName: "Breakthrough",
      cardSizePixel: { width: 750, height: 500 },
      cardSizeWorld: { width: 6.3, height: 4.2 },
      cards,
    };

    const filenameToData: {
      [key: string]: Buffer;
    } = await new CreateCardsheet(createCardsheetParams).toFileData();
    for (const [filename, data] of Object.entries(filenameToData)) {
      this.addOutputFile(filename, data);
    }
  }
}
