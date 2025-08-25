import { AbstractGen } from "../abstract-gen/abstract-gen";
import { TestHomebrew } from "../../../data/test/test-homebrew";
import { GenFactionSheet } from "./gen-faction-sheet";

it("output files", async () => {
  const gen: AbstractGen = new GenFactionSheet(TestHomebrew).setPrebuildDir(
    `src/lib/gen/gen-faction-sheet/prebuild`
  );

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "Templates/faction-sheet/my-faction.json",
    "Textures/faction-sheet/my-faction.back.jpg",
    "Textures/faction-sheet/my-faction.face.jpg",
  ]);
});
