import { TestHomebrew } from "../../../data/test/test-homebrew";
import { AbstractGen } from "../../gen/abstract-gen/abstract-gen";
import { GenExtTokenSameFaceAndBack } from "./gen-ext-token-same-face-and-back";

it("output files", async () => {
  const gen: AbstractGen = new GenExtTokenSameFaceAndBack(TestHomebrew)
    .setPrebuildDir(`src/lib/gen-ext/gen-ext-token-same-face-and-back/prebuild`)
    .setToken("my-token");

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "Models/token/round.obj",
    "Templates/token/my-token.json",
    "Textures/token/my-token.jpg",
  ]);
});
