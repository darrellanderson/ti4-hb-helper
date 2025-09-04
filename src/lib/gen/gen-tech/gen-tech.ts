import { HomebrewModuleType, TechSchemaType } from "ti4-ttpg-ts";
import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "ttpg-darrell/build/cjs/index-ext";
import { AbstractGen } from "../abstract-gen";

import fs from "fs";

export class GenTech extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    const cards: Array<CardsheetCardType> = [];
    const source: string = this.getSource();

    const prebuildDir: string = this.getPrebuildDir();
    const back: string = `${prebuildDir}/card/tech/technology-none.back.jpg`;
    fs.cpSync(
      `${__dirname}/../../../../src/data/jpg/technology-none.back.jpg`,
      back
    );

    this.getTechnologies().forEach((technology: TechSchemaType) => {
      if (technology.customModel) {
        return;
      }

      cards.push({
        name: technology.name,
        face: `${prebuildDir}/card/tech/${technology.nsidName}.jpg`,
        metadata: `card.technology.${technology.color}:${source}/${technology.nsidName}`,
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
      assetFilename: `card/technology/${source}`,
      templateName: "Technologies",
      cardSizePixel: { width: 750, height: 500 },
      cardSizeWorld: { width: 6.3, height: 4.2 },
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
