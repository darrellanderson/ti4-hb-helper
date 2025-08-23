import {
  HomebrewModuleType,
  SystemAttachmentSchemaType,
} from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen/abstract-gen";
import { getGuid } from "../../../lib/guid/guid";

import fs from "fs";
import { TOKEN_TEMPLATE } from "../../../data/template/token.template";

/**
 * Create system attachment tokens.
 *
 * Input: prebuild/token/attachment/system/*.jpg
 *
 * Output:
 * - assets/Templates/token/attachment/system/*.json
 * - assets/Textures/token/attachment/system/*.jpg
 */
export class GenSystemAttachment extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    this._generateModels();

    this.getSystemAttachments().forEach(
      (attachment: SystemAttachmentSchemaType): void => {
        this._generateToken(attachment, errors);
      }
    );
  }

  _generateModels() {
    const models: Array<string> = [
      "round.obj",
      "round.col.obj",
      "mirage.obj",
      "mirage.col.obj",
      "wormhole-creuss.obj",
      "wormhole-creuss.col.obj",
    ];
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
    systemAttachmentSchema: SystemAttachmentSchemaType,
    errors: Array<string>
  ) {
    const source: string = this.getSource();
    const name: string = systemAttachmentSchema.name;
    const nsidName: string = systemAttachmentSchema.nsidName;
    const nsid: string = `token.attachment.system:${source}/${nsidName}`;

    let imgFileFace: string = `token/attachment/system/${nsidName}.jpg`;
    let imgFileBack: string = imgFileFace;
    if (systemAttachmentSchema.imgFaceDown) {
      imgFileBack = `token/attachment/system/${nsidName}.back.jpg`;
    }
    let modelFileFace: string = "token/round.obj";
    let modelFileBack: string = "token/round.obj";

    let modelCollider: string = "token/round.col.obj";
    const modelScale = 1;

    // Rewrite some outliers.
    if (nsidName.startsWith("dimensional-tear")) {
      imgFileFace = `token/attachment/system/dimensional-tear.jpg`;
    } else if (
      nsidName.startsWith("wormhole-") &&
      nsidName.endsWith(".creuss")
    ) {
      imgFileBack = "";
      modelFileFace = "token/wormhole-creuss.obj";
      modelFileBack = ""; // wormhole.obj has face and back in same image
      modelCollider = "token/wormhole-creuss.col.obj";
    } else if (systemAttachmentSchema.planets?.length === 1) {
      imgFileBack = "";
      modelFileFace = "token/mirage.obj";
      modelFileBack = "";
      modelCollider = "token/mirage.col.obj";
    }

    const templateFilename: string = `Templates/token/attachment/system/${nsidName}.json`;
    const GUID: string = getGuid(templateFilename);

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

    const prebuildDir: string = this.getPrebuildDir();
    const copyFiles: Array<string> = [imgFileFace, imgFileBack];
    for (const file of copyFiles) {
      const srcFilename: string = `${prebuildDir}/${file}`;
      if (!fs.existsSync(srcFilename)) {
        errors.push(`System attachment image not found: ${file}`);
        continue;
      }
      const dstFilename: string = `Textures/${file}`;
      const outBuffer: Buffer = fs.readFileSync(srcFilename);
      this.addOutputFile(dstFilename, outBuffer);
    }
  }
}
