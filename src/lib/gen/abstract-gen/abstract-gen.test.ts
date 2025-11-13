import { HomebrewModuleType } from "ti4-ttpg-ts";
import { AbstractGen } from "./abstract-gen";

import fs from "fs";
import path from "path";

class MyAbstractGen extends AbstractGen {}

it("output filename", () => {
  const filename: string = AbstractGen._validateFilenameOrThrow(
    "Models/somefile.obj"
  );
  expect(filename).toBe("assets/Models/somefile.obj");
});

it("output filename (invalid second part)", () => {
  expect(() => {
    AbstractGen._validateFilenameOrThrow("Invalid/somefile.obj");
  }).toThrow();
});

it("writeOutputFiles", async () => {
  const homebrew: HomebrewModuleType = {
    sourceAndPackageId: { source: "test", packageId: "my-package-id" },
  };
  const gen: AbstractGen = new MyAbstractGen(homebrew);

  const data: Buffer = fs.readFileSync(
    path.join(__dirname, "..", "..", "..", "data", "png", "blank.png")
  );
  gen.addOutputFile("Textures/blank.png", data);
  await gen.writeOutputFiles();
});
