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
    "assets/Templates/Textures/card/legendary-planet/my-source/my-source.json",
    "assets/Templates/Textures/card/planet/my-source.jpg/my-source.jpg.json",
    "assets/Textures/Textures/card/legendary-planet/my-source/my-source.back.jpg",
    "assets/Textures/Textures/card/legendary-planet/my-source/my-source.face.jpg",
    "assets/Textures/Textures/card/planet/my-source.jpg/my-source.jpg.back.jpg",
    "assets/Textures/Textures/card/planet/my-source.jpg/my-source.jpg.face.jpg",
  ]);
});
