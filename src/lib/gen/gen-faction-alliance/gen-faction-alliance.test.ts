import { AbstractGen } from "../abstract-gen/abstract-gen";
import { TestHomebrew } from "../../../data/test/test-homebrew";
import { GenFactionAlliance } from "./gen-faction-alliance";

it("output files", async () => {
  expect(TestHomebrew.factions?.[0]?.breakthroughs?.length).toBeGreaterThan(0);
  const gen: AbstractGen = new GenFactionAlliance(TestHomebrew).setPrebuildDir(
    `src/lib/gen/gen-faction-alliance/prebuild`
  );

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "assets/Templates/card/alliance/my-source/my-source.json",
    "assets/Textures/card/alliance/my-source/my-source.back.jpg",
    "assets/Textures/card/alliance/my-source/my-source.face.jpg",
  ]);
});
