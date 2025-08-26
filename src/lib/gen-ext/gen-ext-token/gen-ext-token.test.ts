import { TestHomebrew } from "../../../data/test/test-homebrew";
import { AbstractGen } from "../../gen/abstract-gen/abstract-gen";
import { GenExtToken } from "./gen-ext-token";

it("output files", async () => {
  const gen: AbstractGen = new GenExtToken(TestHomebrew)
    .setPrebuildDir(`src/lib/gen-ext/gen-ext-token/prebuild`)
    .setToken("my-token");

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "Models/token/round.obj",
    "Textures/token/my-token.back.jpg",
    "Textures/token/my-token.face.jpg",
  ]);
});
