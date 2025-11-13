import { FactionSchemaType, HomebrewModuleType } from "ti4-ttpg-ts";
import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "ttpg-darrell/build/cjs/index-ext";
import { AbstractGen } from "../abstract-gen/abstract-gen";
import { nsidNameToName } from "../../nsid-name-to-name/nsid-name-to-name";

import fs from "fs";
import path from "path";

export class GenFactionAlliance extends AbstractGen {
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
      "alliance",
      "alliance.back.jpg"
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
        "alliance.back.jpg"
      ),
      back
    );
    this.getFactions().forEach((faction: FactionSchemaType): void => {
      if (faction.leaders.commanders.length > 0) {
        const cardNsidName: string = faction.nsidName;
        cards.push({
          name: nsidNameToName(cardNsidName),
          face: path.join(
            prebuildDir,
            "card",
            "alliance",
            `${cardNsidName}.jpg`
          ),
          metadata: `card.alliance:${source}/${cardNsidName}`,
        });
      }
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
      assetFilename: path.join("card", "alliance", source).replace(/\\/g, "/"),
      templateName: "Alliance",
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
