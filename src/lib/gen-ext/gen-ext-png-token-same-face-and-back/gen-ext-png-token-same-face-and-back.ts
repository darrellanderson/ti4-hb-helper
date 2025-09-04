import { HomebrewModuleType } from "ti4-ttpg-ts";
import { AbstractGen } from "../../gen/abstract-gen/abstract-gen";
import { getGuid } from "../../guid/guid";
import { PNG_TOKEN_TEMPLATE } from "../../../data/template/png-token.template";
import { nsidNameToName } from "../../nsid-name-to-name";

import fs from "fs";
import path from "path";
import sharp, { Metadata } from "sharp";

/**
 * Create a PNG token with the same shared face and back image.
 */
export class GenExtPngTokenSameFaceAndBack extends AbstractGen {
  private _token: string = "";
  private _tokenExtraPath: string = "";
  private _width: number = 5;

  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  setToken(token: string): this {
    this._token = token;
    return this;
  }

  setTokenExtraPath(tokenExtraPath: string): this {
    this._tokenExtraPath = tokenExtraPath;
    return this;
  }

  setWidth(width: number): this {
    this._width = width;
    return this;
  }

  async generate(errors: Array<string>): Promise<void> {
    if (this._token === "") {
      errors.push("GenExtPngTokenSameFaceAndBack: token is not set");
      return;
    }

    const prebuildDir: string = this.getPrebuildDir();
    const image: string = path.join(
      prebuildDir,
      "token",
      this._tokenExtraPath, // ignored if empty
      `${this._token}.png`
    );
    if (!fs.existsSync(image)) {
      errors.push(
        `GenExtPngTokenSameFaceAndBack: token image not found: ${image}`
      );
      return;
    }
    const imageData: Buffer = fs.readFileSync(image);
    this.addOutputFile(
      path.join(
        "Textures",
        "token",
        this._tokenExtraPath,
        `${this._token}.png`
      ),
      imageData
    );

    const pixelSize: Metadata = await sharp(imageData).metadata();
    const height: number = Math.round(
      (this._width * (pixelSize.height ?? 1)) / (pixelSize.width ?? 1)
    );

    const templateFilename: string = path.join(
      "Templates",
      "token",
      this._tokenExtraPath, // ignored if empty
      `${this._token}.json`
    );
    const GUID: string = getGuid(templateFilename);

    const source: string = this.getSource();
    const nsidType = path
      .join("token", this._tokenExtraPath)
      .replaceAll("/", ".");
    const nsid: string = `${nsidType}:${source}/${this._token}`;

    const template = JSON.parse(JSON.stringify(PNG_TOKEN_TEMPLATE));
    template.GUID = GUID;
    template.Name = nsidNameToName(this._token);
    template.Metadata = nsid;
    template.FrontTexture = path.join(
      "token",
      this._tokenExtraPath,
      `${this._token}.png`
    );
    template.BackTexture = path.join(
      "token",
      this._tokenExtraPath,
      `${this._token}.png`
    );
    template.Model = template.FrontTexture;
    template.Width = this._width;
    template.Height = height;

    const templateData: Buffer = Buffer.from(
      JSON.stringify(template, null, 2),
      "utf-8"
    );
    this.addOutputFile(templateFilename, templateData);
  }
}
