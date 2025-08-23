import { AbstractGen } from "../abstract-gen/abstract-gen";
import { TestHomebrew } from "../../../data/test/test-homebrew";
import { GenFactionPromissory } from "./gen-faction-promissory";

it("output files", async () => {
  const gen: AbstractGen = new GenFactionPromissory(
    TestHomebrew
  ).setPrebuildDir(`src/lib/gen/gen-faction-promissory/prebuild`);

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFiles()).toEqual([
    "assets/Templates/card/promissory/my-source/my-source.json",
    "assets/Textures/card/promissory/my-source/my-source.back.jpg",
    "assets/Textures/card/promissory/my-source/my-source.face.jpg",
  ]);
});
