import { HomebrewModuleType } from "ti4-ttpg-ts";
import { AbstractGen } from "../../gen/abstract-gen/abstract-gen";
import { TOKEN_TEMPLATE } from "../../../data/template/token.template";
import { getGuid } from "../../guid";
import { nsidNameToName } from "../../nsid-name-to-name";

import fs from "fs";
import path from "path";

/**
 * Generate a round token with a face and back image.
 */
export class GenExtToken extends AbstractGen {
  private _token: string = "";
  private _script: string = "";

  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  setToken(token: string): this {
    this._token = token;
    return this;
  }

  setScript(script: string): this {
    this._script = script;
    return this;
  }

  async generate(errors: Array<string>): Promise<void> {
    if (this._token === "") {
      errors.push("GenExtToken: token is not set");
      return;
    }

    const source: string = this.getSource();

    const model: string = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "src",
      "data",
      "model",
      "round.obj"
    );
    const modelData: Buffer = fs.readFileSync(model);
    this.addOutputFile(path.join("Models", "token", "round.obj"), modelData);

    const prebuildDir: string = this.getPrebuildDir();
    const imageFace: string = path.join(
      prebuildDir,
      "token",
      `${this._token}.face.jpg`
    );
    if (!fs.existsSync(imageFace)) {
      errors.push(`GenExtToken: token image not found: ${imageFace}`);
      return;
    }
    const imageFaceData: Buffer = fs.readFileSync(imageFace);
    this.addOutputFile(
      path.join("Textures", "token", `${this._token}.face.jpg`),
      imageFaceData
    );

    const imageBack: string = path.join(
      prebuildDir,
      "token",
      `${this._token}.back.jpg`
    );
    if (!fs.existsSync(imageBack)) {
      errors.push(`GenExtToken: token image not found: ${imageBack}`);
      return;
    }
    const imageBackData: Buffer = fs.readFileSync(imageBack);
    this.addOutputFile(
      path.join("Textures", "token", `${this._token}.back.jpg`),
      imageBackData
    );

    const templateFilename: string = path.join(
      "Templates",
      "token",
      `${this._token}.json`
    );

    const template = TOKEN_TEMPLATE;
    template.GUID = getGuid(templateFilename);
    template.Name = nsidNameToName(this._token);
    template.Metadata = `token:${source}/${this._token}`;
    if (template.Models[0]) {
      template.Models[0].Texture = path
        .join("token", `${this._token}.face.jpg`)
        .replace(/\\/g, "/");
    }
    if (template.Models[1]) {
      template.Models[1].Texture = path
        .join("token", `${this._token}.back.jpg`)
        .replace(/\\/g, "/");
    }
    template.ScriptName = this._script;
    const templateData: Buffer = Buffer.from(
      JSON.stringify(template, null, 2),
      "utf-8"
    );
    this.addOutputFile(templateFilename, templateData);
  }
}
