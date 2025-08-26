import { HomebrewModuleType } from "ti4-ttpg-ts-types";
import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "ttpg-darrell/build/cjs/index-ext";
import { AbstractGen } from "../abstract-gen/abstract-gen";
import { nsidNameToName } from "../../../lib/nsid-name-to-name";

import fs from "fs";
import klawSync from "klaw-sync";
import path from "path";

const CARD_TYPES_PORTRAIT: Array<string> = [
  "action",
  "agenda",
  "exploration-cultural",
  "exploration-hazardous",
  "exploration-frontier",
  "exploration-industrial",
  "objective-public-1",
  "objective-public-2",
  "objective-secret",
  "relic",
];

/**
 * Cards directly linked to factions (e.g. leader suite)
 * are generated using that data, so any kruft cards do
 * not get added.
 *
 * This generator is for other cards types that cannot be
 * inferred otherwise (e.g. action cards).
 */
export class GenCards extends AbstractGen {
  /**
   * Get cards by wlking the directory, uses a shared back image.
   *
   * @param type
   * @returns
   */
  _getCards(type: string): Array<CardsheetCardType> | undefined {
    const prebuild: string = this.getPrebuildDir();
    const root: string = `${prebuild}/card/${type}`;

    if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
      return undefined;
    }

    const jpgFilenames = klawSync(root, {
      filter: (item) => path.extname(item.path) === ".jpg",
      nodir: true,
      traverseAll: true,
    }).map((item) => item.path);

    const source: string = this.getSource();
    return jpgFilenames.map((filename: string): CardsheetCardType => {
      const nsidName = path.basename(filename).replace(/\.jpg$/, "");

      // filename path is absolute, we want relative.
      const face: string = `${prebuild}/card/${type}/${nsidName}.jpg`;
      if (!fs.existsSync(face)) {
        throw new Error(`Face image not found: ${face}`);
      }

      return {
        name: nsidNameToName(nsidName),
        face,
        metadata: `card.${type}:${source}/${nsidName}`,
      };
    });
  }

  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  replaceCardTypes(newTypes: Array<string>): this {
    while (CARD_TYPES_PORTRAIT.length > 0) {
      CARD_TYPES_PORTRAIT.pop();
    }
    CARD_TYPES_PORTRAIT.push(...newTypes);
    return this;
  }

  async generate(errors: Array<string>): Promise<void> {
    const source: string = this.getSource();
    for (const type of CARD_TYPES_PORTRAIT) {
      const cards = this._getCards(type);
      if (!cards) {
        continue;
      }

      const prebuild: string = this.getPrebuildDir();
      const back: string = `${prebuild}/card/${type}.back.jpg`;
      fs.cpSync(`${__dirname}/../../../../src/data/jpg/${type}.back.jpg`, back);

      const createCardsheetParams: CreateCardsheetParams = {
        assetFilename: `card/${type}/${source}`,
        templateName: nsidNameToName(type),
        cardSizePixel: { width: 500, height: 750 },
        cardSizeWorld: { width: 4.2, height: 6.3 },
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
}
