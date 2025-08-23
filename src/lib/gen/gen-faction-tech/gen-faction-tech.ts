import {
  FactionSchemaType,
  HomebrewModuleType,
  TechSchemaType,
} from "ti4-ttpg-ts-types";
import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "ttpg-darrell/build/cjs/index-ext";
import { AbstractGen } from "../abstract-gen/abstract-gen";
import { nsidNameToName } from "../../../lib/nsid-name-to-name/nsid-name-to-name";

import fs from "fs";

export class GenFactionTech extends AbstractGen {
  private readonly _techNsidNameToColor: Map<string, string> = new Map();

  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);

    this.loadTechColors(homebrew.technologies || []);
  }

  loadTechColors(techs: Array<TechSchemaType>): void {
    techs.forEach((tech: TechSchemaType): void => {
      this._techNsidNameToColor.set(tech.nsidName, tech.color);
    });
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

    this.getFactions().forEach((faction: FactionSchemaType): void => {
      faction.factionTechs.forEach((cardNsidName: string): void => {
        const techColor: string | undefined =
          this._techNsidNameToColor.get(cardNsidName);
        if (techColor === undefined) {
          errors.push(`Technology color not found for: ${cardNsidName}`);
        }
        cards.push({
          name: nsidNameToName(cardNsidName),
          face: `${prebuildDir}/card/tech/${cardNsidName}.jpg`,
          metadata: `card.technology.${techColor}:${source}/${cardNsidName}`,
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
      assetFilename: `card/technology/${source}`,
      templateName: `card/technology/${source}.json`,
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
