import { AbstractGen } from "../abstract-gen/abstract-gen";
import { TestHomebrew } from "../../../data/test/test-homebrew";
import { GenFactionBreakthrough } from "./gen-faction-breakthrough";

it("output files", async () => {
  expect(TestHomebrew.factions?.[0]?.breakthroughs?.length).toBeGreaterThan(0);
  const gen: AbstractGen = new GenFactionBreakthrough(
    TestHomebrew
  ).setPrebuildDir(`src/lib/gen/gen-faction-breakthrough/prebuild`);

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "assets/Templates/card/breakthrough/my-source/my-source.json",
    "assets/Textures/card/breakthrough/my-source/my-source.back.jpg",
    "assets/Textures/card/breakthrough/my-source/my-source.face.jpg",
  ]);
});
