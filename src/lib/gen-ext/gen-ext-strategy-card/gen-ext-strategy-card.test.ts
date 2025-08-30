import { TestHomebrew } from "../../../data/test/test-homebrew";
import { AbstractGen } from "../../gen/abstract-gen/abstract-gen";
import { GenExtStrategyCard } from "./gen-ext-strategy-card";

it("output files", async () => {
  const gen: AbstractGen = new GenExtStrategyCard(TestHomebrew)
    .setPrebuildDir(`src/lib/gen-ext/gen-ext-strategy-card/prebuild`)
    .setStrategyCardName("my-strategy-card");

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "Models/tile/strategy-card.obj",
    "Templates/tile/strategy-card/my-strategy-card.json",
    "Textures/tile/strategy-card/my-strategy-card.png",
  ]);
});
