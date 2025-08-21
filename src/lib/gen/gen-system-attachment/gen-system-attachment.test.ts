import { AbstractGen } from "../abstract-gen/abstract-gen";
import { TestHomebrew } from "../../../data/test/test-homebrew";
import { GenSystemAttachment } from "./gen-system-attachment";

it("output files", async () => {
  const gen: AbstractGen = new GenSystemAttachment(TestHomebrew).setPrebuildDir(
    `src/lib/gen/gen-faction-tech/prebuild`
  );

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFiles()).toEqual([
    "Models/round.col.obj",
    "Models/round.obj",
  ]);
});
