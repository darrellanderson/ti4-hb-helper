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
  expect(gen._getOutputFiles()).toEqual([
    "Models/system-tile-off-map.back.obj",
    "Models/system-tile-off-map.face.obj",
    "Models/system-tile.col.obj",
    "Models/system-tile.obj",
    "Templates/tile/system/system-998.json",
    "Templates/tile/system/system-999.json",
  ]);
});
