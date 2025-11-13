import { HomebrewModuleType, SystemAttachmentSchemaType } from "ti4-ttpg-ts";
import { AbstractGen } from "../abstract-gen/abstract-gen";
import { getGuid } from "../../../lib/guid/guid";
import { TOKEN_TEMPLATE } from "../../../data/template/token.template";

import fs from "fs";
import path from "path";

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
        if (!attachment.customModel) {
          this._generateToken(attachment, errors);
        }
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
    const srcDir: string = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "src",
      "data",
      "model"
    );
    const dstDir: string = path.join("Models", "token");

    models.forEach((model) => {
      const srcFile = path.join(srcDir, model);
      const dstFile = path.join(dstDir, model);
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

    let imgFileFace: string = path
      .join("token", "attachment", "system", `${nsidName}.jpg`)
      .replace(/\\/g, "/");
    let imgFileBack: string = imgFileFace;
    if (systemAttachmentSchema.imgFaceDown) {
      imgFileBack = path
        .join("token", "attachment", "system", `${nsidName}.back.jpg`)
        .replace(/\\/g, "/");
    }
    let modelFileFace: string = path
      .join("token", "round.obj")
      .replace(/\\/g, "/");
    let modelFileBack: string = path
      .join("token", "round.obj")
      .replace(/\\/g, "/");

    let modelCollider: string = path
      .join("token", "round.col.obj")
      .replace(/\\/g, "/");
    const modelScale = 1;

    // Rewrite some outliers.
    if (nsidName.startsWith("dimensional-tear")) {
      imgFileFace = path
        .join("token", "attachment", "system", "dimensional-tear.jpg")
        .replace(/\\/g, "/");
    } else if (
      nsidName.startsWith("wormhole-") &&
      nsidName.endsWith(".creuss")
    ) {
      imgFileBack = "";
      modelFileFace = path
        .join("token", "wormhole-creuss.obj")
        .replace(/\\/g, "/");
      modelFileBack = ""; // wormhole.obj has face and back in same image
      modelCollider = path
        .join("token", "wormhole-creuss.col.obj")
        .replace(/\\/g, "/");
    } else if (systemAttachmentSchema.planets?.length === 1) {
      imgFileBack = "";
      modelFileFace = path.join("token", "mirage.obj").replace(/\\/g, "/");
      modelFileBack = "";
      modelCollider = path.join("token", "mirage.col.obj").replace(/\\/g, "/");
    }

    const templateFilename: string = path.join(
      "Templates",
      "token",
      "attachment",
      "system",
      `${nsidName}.json`
    );
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
      const srcFilename: string = path.join(prebuildDir, file);
      if (!fs.existsSync(srcFilename) || !fs.statSync(srcFilename).isFile()) {
        errors.push(`System attachment image not found: ${file}`);
        continue;
      }
      const dstFilename: string = path.join("Textures", file);
      const outBuffer: Buffer = fs.readFileSync(srcFilename);
      this.addOutputFile(dstFilename, outBuffer);
    }
  }
}
