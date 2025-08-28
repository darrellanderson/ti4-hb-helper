import { AbstractGen } from "../abstract-gen/abstract-gen";
import { TestHomebrew } from "../../../data/test/test-homebrew";
import { GenCmdCtrlTokens } from "./gen-cmd-ctrl-tokens";

it("output files", async () => {
  expect(TestHomebrew.factions?.[0]?.breakthroughs?.length).toBeGreaterThan(0);
  const gen: AbstractGen = new GenCmdCtrlTokens(TestHomebrew).setPrebuildDir(
    `src/lib/gen/gen-cmd-ctrl-tokens/prebuild`
  );

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "Models/token/command.obj",
    "Models/token/control.obj",
    "Templates/token/command/my-faction.json",
    "Templates/token/control/my-faction.json",
    "Textures/token/command-control/mask.png",
    "Textures/token/command-control/my-faction.jpg",
  ]);
});
