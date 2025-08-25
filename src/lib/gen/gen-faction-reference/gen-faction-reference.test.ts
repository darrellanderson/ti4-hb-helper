import { AbstractGen } from "../abstract-gen/abstract-gen";
import { TestHomebrew } from "../../../data/test/test-homebrew";
import { GenFactionReference } from "./gen-faction-reference";

it("output files", async () => {
  const gen: AbstractGen = new GenFactionReference(TestHomebrew).setPrebuildDir(
    `src/lib/gen/gen-faction-reference/prebuild`
  );

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "assets/Templates/card/faction-reference/my-source/my-source.json",
    "assets/Textures/card/faction-reference/my-source/my-source.back.jpg",
    "assets/Textures/card/faction-reference/my-source/my-source.face.jpg",
  ]);
});
