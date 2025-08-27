import { TestHomebrew } from "../../../data/test/test-homebrew";
import { AbstractGen } from "../../gen/abstract-gen/abstract-gen";
import { GenExtPngToken } from "./gen-ext-png-token";

it("output files", async () => {
  const gen: AbstractGen = new GenExtPngToken(TestHomebrew)
    .setPrebuildDir(`src/lib/gen-ext/gen-ext-png-token/prebuild`)
    .setToken("my-token");

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "Templates/token/my-token.json",
    "Textures/token/my-token.back.png",
    "Textures/token/my-token.face.png",
  ]);
});
