import { TestHomebrew } from "../../../data/test/test-homebrew";
import { AbstractGen } from "../../gen/abstract-gen/abstract-gen";
import { GenExtPngTokenSameFaceAndBack } from "./gen-ext-png-token-same-face-and-back";

it("output files", async () => {
  const gen: AbstractGen = new GenExtPngTokenSameFaceAndBack(TestHomebrew)
    .setPrebuildDir(
      `src/lib/gen-ext/gen-ext-png-token-same-face-and-back/prebuild`
    )
    .setToken("my-token");

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "Templates/token/my-token.json",
    "Textures/token/my-token.png",
  ]);
});
