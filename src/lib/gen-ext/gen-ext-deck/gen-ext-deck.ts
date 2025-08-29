import { HomebrewModuleType } from "ti4-ttpg-ts-types";
import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "ttpg-darrell/build/cjs/index-ext";
import { AbstractGen } from "../../gen/abstract-gen/abstract-gen";
import { nsidNameToName } from "../../nsid-name-to-name/nsid-name-to-name";

import fs from "fs";
import klawSync from "klaw-sync";
import path from "path";

export class GenExtDeck extends AbstractGen {
  private _deckType: string = "";
  private _isLandscape: boolean = false;
  private _isSharedBack: boolean = false;

  private _overrideOutputDeckType: string | undefined = undefined;

  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  setDeckType(deckType: string): this {
    this._deckType = deckType;
    return this;
  }

  setIsLandscape(landscape: boolean): this {
    this._isLandscape = landscape;
    return this;
  }

  setIsSharedBack(sharedBack: boolean): this {
    this._isSharedBack = sharedBack;
    return this;
  }

  setOverrideOutputDeckType(deckType: string): this {
    this._overrideOutputDeckType = deckType;
    return this;
  }

  async generate(errors: Array<string>): Promise<void> {
    if (this._deckType === "") {
      errors.push("Deck type is not set");
      return;
    }

    const cards: Array<CardsheetCardType> = [];
    const source: string = this.getSource();

    const prebuildDir: string = this.getPrebuildDir();
    const deckRoot: string = path.join(prebuildDir, "card", this._deckType);
    if (!fs.existsSync(deckRoot) || !fs.lstatSync(deckRoot).isDirectory()) {
      errors.push(`Deck directory not found: ${deckRoot}`);
      return;
    }

    const jpgFilenames = klawSync(deckRoot, {
      filter: (item) => path.extname(item.path) === ".jpg",
      nodir: true,
      traverseAll: true,
    }).map((item) => item.path);

    jpgFilenames.forEach((filename: string): void => {
      const nsidName = path
        .basename(filename)
        .replace(/\.jpg$/, "")
        .replace(/\.face$/, "");
      if (nsidName.endsWith(".back")) {
        return; // only process face
      }

      let face: string = path.join(
        prebuildDir,
        "card",
        this._deckType,
        `${nsidName}.jpg`
      );
      let back: string | undefined = undefined;
      if (!this._isSharedBack) {
        face = face.replace(/.jpg$/, ".face.jpg");
        back = face.replace(/.face.jpg$/, ".back.jpg");
      }

      const card: CardsheetCardType = {
        name: nsidNameToName(nsidName),
        face,
        back,
        metadata: `card.${this._deckType}:${source}/${nsidName}`,
      };

      if (this._overrideOutputDeckType) {
        card.metadata = `card.${this._overrideOutputDeckType}:${source}/${nsidName}`;
      }

      cards.push(card);
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
      assetFilename: `card/${this._deckType}/${source}`,
      templateName: nsidNameToName(this._deckType),
      cardSizePixel: { width: 500, height: 750 },
      cardSizeWorld: { width: 4.2, height: 6.3 },
      cards,
    };

    if (this._isLandscape) {
      createCardsheetParams.cardSizePixel = { width: 750, height: 500 };
      createCardsheetParams.cardSizeWorld = { width: 6.3, height: 4.2 };
    }

    if (this._isSharedBack) {
      createCardsheetParams.back = path.join(
        prebuildDir,
        "card",
        `${this._deckType}.back.jpg`
      );
    }

    const filenameToData: {
      [key: string]: Buffer;
    } = await new CreateCardsheet(createCardsheetParams).toFileData();
    for (const [filename, data] of Object.entries(filenameToData)) {
      this.addOutputFile(filename, data);
    }
  }
}
