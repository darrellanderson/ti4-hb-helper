import { AbstractGen } from "../abstract-gen/abstract-gen";
import { TestHomebrew } from "../../../data/test/test-homebrew";
import { GenInject } from "./gen-inject";

it("output files", async () => {
  const gen: AbstractGen = new GenInject(TestHomebrew).setPrebuildDir(
    `src/lib/gen/gen-inject/prebuild`
  );

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFiles()).toEqual(["src/homebrew.ts", "src/inject.ts"]);
});
