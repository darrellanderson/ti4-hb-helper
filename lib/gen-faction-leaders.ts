import { FactionSchemaType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "./abstract-gen";

import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "../node_modules/ttpg-darrell/build/cjs/index-ext";
import { nsidNameToName } from "./nsid-name-to-name";

import fs from "fs";

export class GenFactionLeaders extends AbstractGen {
  constructor(source: string, faction: FactionSchemaType) {
    super(source, faction);
  }

  async generate(errors: Array<string>): Promise<void> {
    const cards: Array<CardsheetCardType> = [];
    const nsidName: string = this.getFaction().nsidName;

    const source: string = this.getSource();
    const addCard = (leaderType: string, nsidName: string): void => {
      cards.push({
        name: nsidNameToName(nsidName),
        face: `prebuild/card/leader/${nsidName}.face.jpg`,
        back: `prebuild/card/leader/${nsidName}.back.jpg`,
        metadata: `card.leader.${leaderType}:${source}/${nsidName}`,
      });
    };

    this.getFaction().leaders.agents.forEach((agent: string): void => {
      addCard("agent", agent);
    });
    this.getFaction().leaders.commanders.forEach((commander: string): void => {
      addCard("commander", commander);
    });
    this.getFaction().leaders.heroes.forEach((hero: string): void => {
      addCard("hero", hero);
    });
    this.getFaction().leaders.mechs.forEach((mech: string): void => {
      addCard("mech", mech);
    });

    for (const card of cards) {
      if (typeof card.face === "string" && !fs.existsSync(card.face)) {
        errors.push(`Face image not found: ${card.face}`);
      }
      if (typeof card.back === "string" && !fs.existsSync(card.back)) {
        errors.push(`Back image not found: ${card.back}`);
      }
    }

    const createCardsheetParams: CreateCardsheetParams = {
      assetFilename: `Textures/card/leader/${nsidName}.jpg`,
      templateName: `Templates/card/leader/${nsidName}.json`,
      cardSizePixel: { width: 750, height: 500 },
      cardSizeWorld: { width: 6.3, height: 4.2 },
      cards,
    };
  }
}
