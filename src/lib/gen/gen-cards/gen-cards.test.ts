import { AbstractGen } from "../abstract-gen/abstract-gen";
import { TestHomebrew } from "../../../data/test/test-homebrew";
import { GenCards } from "./gen-cards";
import { CardsheetCardType } from "ttpg-darrell/build/cjs/index-ext";

it("_getCards", () => {
  const gen: GenCards = new GenCards(TestHomebrew).setPrebuildDir(
    `src/lib/gen/gen-cards/prebuild`
  );

  const cards: Array<CardsheetCardType> | undefined = gen._getCards("action");
  expect(cards).toHaveLength(1);
  expect(cards?.[0]).toEqual({
    name: "My Action",
    face: "src/lib/gen/gen-cards/prebuild/card/action/my-action.jpg",
    metadata: "card.action:my-source/my-action",
    back: undefined,
  });
});

it("output files", async () => {
  const gen: AbstractGen = new GenCards(TestHomebrew).setPrebuildDir(
    `src/lib/gen/gen-cards/prebuild`
  );

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "assets/Templates/card/action/my-source/my-source.json",
    "assets/Textures/card/action/my-source/my-source.back.jpg",
    "assets/Textures/card/action/my-source/my-source.face.jpg",
  ]);
});
