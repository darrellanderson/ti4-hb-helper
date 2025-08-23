import { AbstractGen } from "../abstract-gen/abstract-gen";
import { TestHomebrew } from "../../../data/test/test-homebrew";
import { GenPlanetCards } from "./gen-planet-cards";

it("output files", async () => {
  const gen: AbstractGen = new GenPlanetCards(TestHomebrew).setPrebuildDir(
    `src/lib/gen/gen-planet-cards/prebuild`
  );

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFiles()).toEqual([
    "assets/Templates/card/legendary-planet/my-source/my-source.json",
    "assets/Templates/card/planet/my-source/my-source.json",
    "assets/Textures/card/legendary-planet/my-source/my-source.back.jpg",
    "assets/Textures/card/legendary-planet/my-source/my-source.face.jpg",
    "assets/Textures/card/planet/my-source/my-source.back.jpg",
    "assets/Textures/card/planet/my-source/my-source.face.jpg",
  ]);
});
