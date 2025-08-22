import { TestHomebrew } from "../../../data/test/test-homebrew";
import { AbstractGen } from "../abstract-gen";
import { GenAll } from "./gen-all";

it("errors", async () => {
  const gen: AbstractGen = new GenAll(TestHomebrew);
  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors.length).toBeGreaterThan(0);
});
