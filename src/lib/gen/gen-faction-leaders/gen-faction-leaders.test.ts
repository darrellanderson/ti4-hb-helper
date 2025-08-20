import { AbstractGen } from "../abstract-gen/abstract-gen";
import { TestHomebrew } from "../../../data/test/test-homebrew";
import { GenFactionLeaders } from "./gen-faction-leaders";

it("output files", async () => {
  const gen: AbstractGen = new GenFactionLeaders(TestHomebrew).setPrebuildDir(
    `src/lib/gen/gen-faction-leaders/prebuild`
  );
  expect(gen.getSource()).toEqual("my-source");

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFiles()).toEqual([
    "assets/Templates/Textures/card/leader/my-source/my-source.json",
    "assets/Textures/Textures/card/leader/my-source/my-source.back.jpg",
    "assets/Textures/Textures/card/leader/my-source/my-source.face.jpg",
  ]);
});
