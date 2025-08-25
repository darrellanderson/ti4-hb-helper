import { AbstractGen } from "../abstract-gen/abstract-gen";
import { TestHomebrew } from "../../../data/test/test-homebrew";
import { GenTech } from "./gen-tech";

it("output files", async () => {
  const gen: AbstractGen = new GenTech(TestHomebrew).setPrebuildDir(
    `src/lib/gen/gen-tech/prebuild`
  );

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "assets/Templates/card/technology/my-source/my-source.json",
    "assets/Textures/card/technology/my-source/my-source.back.jpg",
    "assets/Textures/card/technology/my-source/my-source.face.jpg",
  ]);
});
