import { TestHomebrew } from "../../../data/test/test-homebrew";
import { AbstractGen } from "../../gen/abstract-gen/abstract-gen";
import { GenExtDeck } from "./gen-ext-deck";

it("output files", async () => {
  const gen: AbstractGen = new GenExtDeck(TestHomebrew)
    .setPrebuildDir(`src/lib/gen-ext/gen-ext-deck/prebuild`)
    .setDeckType("my-type");

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "assets/Templates/card/my-type/my-source/my-source.json",
    "assets/Textures/card/my-type/my-source/my-source.back.jpg",
    "assets/Textures/card/my-type/my-source/my-source.face.jpg",
  ]);
});
