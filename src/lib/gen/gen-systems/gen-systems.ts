import { HomebrewModuleType, SystemSchemaType } from "ti4-ttpg-ts";
import { AbstractGen } from "../abstract-gen/abstract-gen";
import { SYSTEM_TILE_TEMPLATE } from "../../../data/template/system-tile.template";
import { getGuid } from "../../../lib/guid/guid";

import fs from "fs";
import sharp from "sharp";

export class GenSystems extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    for (const system of this.getSystems()) {
      if (system.tile > 0) {
        await this._generateOne(system, errors);
      }
    }
    this._generateModels();
    this._generateDefaultBacks();
  }

  async _generateOne(
    system: SystemSchemaType,
    errors: Array<string>
  ): Promise<void> {
    this._generateTemplate(system);

    const prebuildDir: string = this.getPrebuildDir();
    const tileStr: string = system.tile.toString().padStart(3, "0");
    let srcFilename: string = `${prebuildDir}/tile/system/tile-${tileStr}.jpg`;
    if (!fs.existsSync(srcFilename)) {
      errors.push(`System tile image not found: ${srcFilename}`);
      return;
    }

    // Make a square, with the hex filling the width (space at top/bottom).
    let srcBuffer: Buffer = await sharp(srcFilename)
      .resize(1024, 1024, { fit: "contain", position: "center" })
      .png()
      .toBuffer();

    let dst1024filename: string = `Textures/tile/system/tile-${tileStr}.jpg`;
    let dst512filename: string = `Textures/tile/system/tile-${tileStr}.png`;

    await this._generate1024(srcBuffer, dst1024filename);
    await this._generate512(srcBuffer, dst512filename);

    if (system.imgFaceDown) {
      srcFilename = srcFilename.replace(/.jpg$/, ".back.jpg");
      if (!fs.existsSync(srcFilename)) {
        errors.push(`System tile image not found: ${srcFilename}`);
        return;
      }
      srcBuffer = await sharp(srcFilename)
        .resize(1024, 1024, { fit: "contain", position: "center" })
        .png()
        .toBuffer();
      dst1024filename = dst1024filename.replace(/.jpg$/, ".back.jpg");
      dst512filename = dst512filename.replace(/.jpg$/, ".back.jpg");
      await this._generate1024(srcBuffer, dst1024filename);
      await this._generate512(srcBuffer, dst512filename);
    }
  }

  _generateModels() {
    const models: Array<string> = [
      "system-tile-off-map.back.obj",
      "system-tile-off-map.face.obj",
      "system-tile.col.obj",
      "system-tile.obj",
    ];
    const srcDir: string = `${__dirname}/../../../../src/data/model`;
    const dstDir: string = "Models/tile/system";

    models.forEach((model) => {
      const srcFile = `${srcDir}/${model}`;
      const dstFile = `${dstDir}/${model}`;
      if (!fs.existsSync(srcFile)) {
        throw new Error(`Model file not found: ${srcFile}`);
      }
      this.addOutputFile(dstFile, fs.readFileSync(srcFile));
    });
  }

  _generateDefaultBacks() {
    const backs: Array<string> = ["blue", "green", "red"];
    const srcDir: string = `${__dirname}/../../../../src/data/jpg`;
    const dstDir: string = "Textures/tile/system";

    backs.forEach((back) => {
      const srcFile = `${srcDir}/${back}.back.jpg`;
      const dstFile = `${dstDir}/${back}.back.jpg`;
      if (!fs.existsSync(srcFile)) {
        throw new Error(`Back image not found: ${srcFile}`);
      }
      this.addOutputFile(dstFile, fs.readFileSync(srcFile));
    });
  }

  _generateTemplate(system: SystemSchemaType) {
    const tileStr: string = system.tile.toString().padStart(3, "0");
    const template = JSON.parse(JSON.stringify(SYSTEM_TILE_TEMPLATE)); // copy
    const templateFilename: string = `Templates/tile/system/system-${tileStr}.json`;

    const imgFileFace: string = `tile/system/tile-${tileStr}.jpg`;
    let imgFileBack: string = "";
    if (system.imgFaceDown) {
      imgFileBack = `tile/system/tile-${tileStr}.back.jpg`;
    } else if (system.isHome) {
      imgFileBack = "tile/system/green.back.jpg";
    } else if (
      (system.anomalies ?? []).length > 0 ||
      (system.planets ?? []).length === 0
    ) {
      imgFileBack = "tile/system/red.back.jpg";
    } else {
      imgFileBack = "tile/system/blue.back.jpg";
    }

    const modelFileFace: string =
      system.class === "off-map"
        ? "tile/system/system-tile-off-map.face.obj"
        : "tile/system/system-tile.obj";
    const modelFileBack: string =
      system.class === "off-map"
        ? "tile/system/system-tile-off-map.back.obj"
        : "tile/system/system-tile.obj";

    template.GUID = getGuid(templateFilename);
    template.Metadata = `tile.system:${this.getSource()}/${system.tile}`;
    template.Models[0].Texture = imgFileFace;
    template.Models[1].Texture = imgFileBack;
    template.Models[0].Model = modelFileFace;
    template.Models[1].Model = modelFileBack;
    template.Tags = ["system"];

    this.addOutputFile(
      templateFilename,
      Buffer.from(JSON.stringify(template, null, 2), "utf-8")
    );
  }

  async _generate1024(
    srcBuffer: Buffer,
    dst1024filename: string
  ): Promise<void> {
    const jpg884: Buffer = await sharp(srcBuffer)
      .resize(884, 884, { fit: "contain", position: "center" })
      .jpeg({ quality: 90 })
      .toBuffer();
    const jpg1024: Buffer = await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: jpg884, blend: "over", left: 70, top: 70 }])
      .jpeg({ quality: 90 })
      .toBuffer();
    this.addOutputFile(dst1024filename, jpg1024);
  }

  async _generate512(srcBuffer: Buffer, dst512filename: string): Promise<void> {
    const mask = await sharp(`${__dirname}/../../../../src/data/png/blank.png`)
      .resize(512, 512, { fit: "contain", position: "center" })
      .extractChannel("alpha")
      .toBuffer();
    const png512: Buffer = await sharp(srcBuffer)
      .resize(512, 512, { fit: "contain", position: "center" })
      .joinChannel(mask)
      .png()
      .toBuffer();
    this.addOutputFile(dst512filename, png512);
  }
}
