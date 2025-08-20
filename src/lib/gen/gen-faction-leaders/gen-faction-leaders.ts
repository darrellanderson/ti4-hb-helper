import { FactionSchemaType, HomebrewModuleType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen/abstract-gen";

import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "../../../../node_modules/ttpg-darrell/build/cjs/index-ext";
import { nsidNameToName } from "../../../lib/nsid-name-to-name/nsid-name-to-name";

import fs from "fs";

export class GenFactionLeaders extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    const cards: Array<CardsheetCardType> = [];
    const source: string = this.getSource();

    this.getFactions().forEach((faction: FactionSchemaType): void => {
      const addCard = (leaderType: string, cardNsidName: string): void => {
        cards.push({
          name: nsidNameToName(cardNsidName),
          face: `prebuild/card/leader/${cardNsidName}.face.jpg`,
          back: `prebuild/card/leader/${cardNsidName}.back.jpg`,
          metadata: `card.leader.${leaderType}:${source}/${cardNsidName}`,
        });
      };

      faction.leaders.agents.forEach((agent: string): void => {
        addCard("agent", agent);
      });
      faction.leaders.commanders.forEach((commander: string): void => {
        addCard("commander", commander);
      });
      faction.leaders.heroes.forEach((hero: string): void => {
        addCard("hero", hero);
      });
      faction.leaders.mechs.forEach((mech: string): void => {
        addCard("mech", mech);
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
      assetFilename: `Textures/card/leader/${source}.jpg`,
      templateName: `Templates/card/leader/${source}.json`,
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
