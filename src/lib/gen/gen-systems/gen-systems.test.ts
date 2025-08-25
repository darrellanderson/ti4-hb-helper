import { AbstractGen } from "../abstract-gen/abstract-gen";
import { TestHomebrew } from "../../../data/test/test-homebrew";
import { GenSystems } from "./gen-systems";

it("output files", async () => {
  const gen: AbstractGen = new GenSystems(TestHomebrew).setPrebuildDir(
    `src/lib/gen/gen-systems/prebuild`
  );

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "Models/tile/system/system-tile-off-map.back.obj",
    "Models/tile/system/system-tile-off-map.face.obj",
    "Models/tile/system/system-tile.col.obj",
    "Models/tile/system/system-tile.obj",
    "Templates/tile/system/system-998.json",
    "Templates/tile/system/system-999.json",
    "Textures/tile/system/blue.back.jpg",
    "Textures/tile/system/green.back.jpg",
    "Textures/tile/system/red.back.jpg",
    "Textures/tile/system/tile-998.jpg",
    "Textures/tile/system/tile-998.png",
    "Textures/tile/system/tile-999.jpg",
    "Textures/tile/system/tile-999.png",
  ]);
});
