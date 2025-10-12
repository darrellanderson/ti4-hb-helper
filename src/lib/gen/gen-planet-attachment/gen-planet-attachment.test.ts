import { AbstractGen } from "../abstract-gen/abstract-gen";
import { TestHomebrew } from "../../../data/test/test-homebrew";
import { GenPlanetAttachment } from "./gen-planet-attachment";

it("output files", async () => {
  const gen: AbstractGen = new GenPlanetAttachment(TestHomebrew).setPrebuildDir(
    `src/lib/gen/gen-planet-attachment/prebuild`
  );

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "Models/token/round.col.obj",
    "Models/token/round.obj",
    "Templates/token/attachment/planet/my-planet-attachment-face-down.json",
    "Templates/token/attachment/planet/my-planet-attachment.json",
    "Textures/token/attachment/planet/my-planet-attachment-face-down.back.png",
    "Textures/token/attachment/planet/my-planet-attachment-face-down.png",
    "Textures/token/attachment/planet/my-planet-attachment.png",
  ]);
});
