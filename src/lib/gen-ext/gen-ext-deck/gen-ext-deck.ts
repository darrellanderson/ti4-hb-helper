import { HomebrewModuleType } from "ti4-ttpg-ts";
import {
  CardsheetCardType,
  CreateCardsheet,
  CreateCardsheetParams,
} from "ttpg-darrell/ext";
import { AbstractGen } from "../../gen/abstract-gen/abstract-gen";
import { nsidNameToName } from "../../nsid-name-to-name/nsid-name-to-name";

import fs from "fs";
import klawSync from "klaw-sync";
import path from "path";

export class GenExtDeck extends AbstractGen {
  private _deckType: string = "";
  private _isLandscape: boolean = false;
  private _isSharedBack: boolean = false;
  private _tag: string | undefined;

  private _overrideOutputDeckType: string | undefined = undefined;

  private readonly _nsidNameToExtras: Map<string, Array<string>> = new Map();
  private readonly _nsidNameToSubtype: Map<string, string> = new Map();

  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  /**
   * Add "|" extra to the card metadata.
   *
   * @param nsidName
   * @param extra
   */
  addExtra(nsidName: string, extra: string): this {
    let extras: Array<string> | undefined =
      this._nsidNameToExtras.get(nsidName);
    if (!extras) {
      extras = [];
      this._nsidNameToExtras.set(nsidName, extras);
    }
    extras.push(extra);
    return this;
  }

  addSubtype(nsidName: string, subtype: string): this {
    this._nsidNameToSubtype.set(nsidName, subtype);
    return this;
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

  setTag(tag: string): this {
    this._tag = tag;
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
        `${nsidName}.jpg`,
      );
      let back: string | undefined = undefined;
      if (!this._isSharedBack) {
        face = face.replace(/.jpg$/, ".face.jpg");
        back = face.replace(/.face.jpg$/, ".back.jpg");
      }

      const deckType: string = this._overrideOutputDeckType ?? this._deckType;

      let subtype: string = "";
      const overrideSubType: string | undefined =
        this._nsidNameToSubtype.get(nsidName);
      if (overrideSubType) {
        subtype = "." + overrideSubType;
      }

      let extras: string = "";
      const extrasArray: Array<string> | undefined =
        this._nsidNameToExtras.get(nsidName);
      if (extrasArray && extrasArray.length > 0) {
        extras = "|" + extrasArray.join("|");
      }

      const card: CardsheetCardType = {
        name: nsidNameToName(nsidName),
        face,
        back,
        metadata: `card.${deckType}${subtype}:${source}/${nsidName}${extras}`,
      };

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
        `${this._deckType}.back.jpg`,
      );
    }

    if (this._tag) {
      createCardsheetParams.applyAllTags = [this._tag];
    }

    const filenameToData: {
      [key: string]: Buffer;
    } = await new CreateCardsheet(createCardsheetParams).toFileData();
    for (const [filename, data] of Object.entries(filenameToData)) {
      this.addOutputFile(filename, data);
    }
  }
}
