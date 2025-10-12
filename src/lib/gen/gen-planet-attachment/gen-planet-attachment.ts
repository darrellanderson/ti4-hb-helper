import { HomebrewModuleType, PlanetAttachmentSchemaType } from "ti4-ttpg-ts";
import { AbstractGen } from "../abstract-gen/abstract-gen";
import { getGuid } from "../../../lib/guid/guid";

import fs from "fs";
import { TOKEN_TEMPLATE } from "../../../data/template/token.template";

/**
 * Create planet attachment tokens.
 *
 * Input: prebuild/token/attachment/planet/*.jpg
 *
 * Output:
 * - assets/Templates/token/attachment/planet/*.json
 * - assets/Textures/token/attachment/planet/*.jpg
 */
export class GenPlanetAttachment extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    this._generateModels();

    this.getPlanetAttachments().forEach(
      (attachment: PlanetAttachmentSchemaType): void => {
        this._generateToken(attachment, errors);
      }
    );
  }

  _generateModels() {
    const models: Array<string> = ["round.obj", "round.col.obj"];
    const srcDir: string = `${__dirname}/../../../../src/data/model`;
    const dstDir: string = "Models/token";

    models.forEach((model) => {
      const srcFile = `${srcDir}/${model}`;
      const dstFile = `${dstDir}/${model}`;
      if (!fs.existsSync(srcFile)) {
        throw new Error(`Model file not found: ${srcFile}`);
      }
      this.addOutputFile(dstFile, fs.readFileSync(srcFile));
    });
  }

  _generateToken(
    planetAttachmentSchema: PlanetAttachmentSchemaType,
    errors: Array<string>
  ) {
    const source: string = this.getSource();
    const name: string = planetAttachmentSchema.name;
    const nsidName: string = planetAttachmentSchema.nsidName;
    const nsid: string = `token.attachment.planet:${source}/${nsidName}`;

    let imgFileFace: string = `token/attachment/planet/${nsidName}.png`;
    let imgFileBack: string = imgFileFace;
    if (planetAttachmentSchema.imgFaceDown) {
      imgFileBack = `token/attachment/planet/${nsidName}.back.png`;
    }
    let modelFileFace: string = "token/round.obj";
    let modelFileBack: string = "token/round.obj";

    let modelCollider: string = "token/round.col.obj";
    const modelScale = 1;

    const templateFilename: string = `Templates/token/attachment/planet/${nsidName}.json`;
    const GUID: string = getGuid(templateFilename);

    const prebuildDir: string = this.getPrebuildDir();

    const template = JSON.parse(JSON.stringify(TOKEN_TEMPLATE));
    template.GUID = GUID;
    template.Name = name;
    template.Metadata = nsid;
    template.Models[0].Model = modelFileFace;
    template.Models[0].Texture = imgFileFace;
    template.Collision[0].Model = modelCollider;
    template.Models[1].Model = modelFileBack;
    template.Models[1].Texture = imgFileBack;
    template.Models[0].Scale.X *= modelScale;
    template.Models[0].Scale.Y *= modelScale;
    template.Models[1].Scale.X *= modelScale;
    template.Models[1].Scale.Y *= modelScale;
    template.Collision[0].Scale.X *= modelScale;
    template.Collision[0].Scale.Y *= modelScale;

    // Generally tokens have different front/back models, with separate images.
    // Some have a single model with both front/back in the same image.
    if (modelFileBack === "") {
      template.Models.pop();
    }

    this.addOutputFile(
      templateFilename,
      Buffer.from(JSON.stringify(template, null, 2), "utf-8")
    );

    const copyFiles: Array<string> = [imgFileFace, imgFileBack];
    for (const file of copyFiles) {
      const srcFilename: string = `${prebuildDir}/${file}`;
      if (!fs.existsSync(srcFilename)) {
        errors.push(`Planet attachment image not found: ${file}`);
        continue;
      }
      const dstFilename: string = `Textures/${file}`;
      const outBuffer: Buffer = fs.readFileSync(srcFilename);
      this.addOutputFile(dstFilename, outBuffer);
    }
  }
}
