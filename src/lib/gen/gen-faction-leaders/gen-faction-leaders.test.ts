import { AbstractGen } from "../abstract-gen/abstract-gen";
import { GenFactionLeaders } from "./gen-faction-leaders";
import { TestHomebrew } from "../../../data/test/test-homebrew";

it("output files", () => {
  const gen: AbstractGen = new GenFactionLeaders(TestHomebrew);
  const errors: Array<string> = [];
  gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFiles()).toEqual([]);
});
