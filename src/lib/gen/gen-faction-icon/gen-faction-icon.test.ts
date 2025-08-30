import { AbstractGen } from "../abstract-gen/abstract-gen";
import { TestHomebrew } from "../../../data/test/test-homebrew";
import { GenFactionIcon } from "./gen-faction-icon";

it("output files", async () => {
  const gen: AbstractGen = new GenFactionIcon(TestHomebrew).setPrebuildDir(
    `src/lib/gen/gen-faction-icon/prebuild`
  );

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "Textures/icon/faction/my-faction-outline-only.png",
    "Textures/icon/faction/my-faction.png",
  ]);
});
