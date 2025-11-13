import { FactionSchemaType, HomebrewModuleType } from "ti4-ttpg-ts";
import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "ttpg-darrell/build/cjs/index-ext";
import { AbstractGen } from "../abstract-gen/abstract-gen";

import fs from "fs";
import path from "path";

export class GenFactionReference extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    const cards: Array<CardsheetCardType> = [];
    const source: string = this.getSource();

    const prebuildDir: string = this.getPrebuildDir();
    const back: string = path.join(
      prebuildDir,
      "card",
      "faction-reference",
      "faction-reference.back.jpg"
    );
    fs.cpSync(
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "src",
        "data",
        "jpg",
        "faction-reference.back.jpg"
      ),
      back
    );

    this.getFactions().forEach((faction: FactionSchemaType): void => {
      if (!faction.skipFactionReferenceCard) {
        cards.push({
          name: faction.name,
          face: path.join(
            prebuildDir,
            "card",
            "faction-reference",
            `${faction.nsidName}.jpg`
          ),
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
      assetFilename: path
        .join("card", "faction-reference", source)
        .replace(/\\/g, "/"),
      templateName: "Faction Reference",
      cardSizePixel: { width: 1417, height: 826 },
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
