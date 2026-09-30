import { TestHomebrew } from "../../../data/test/test-homebrew";
import { AbstractGen } from "../../gen/abstract-gen/abstract-gen";
import { GenExtDeck } from "./gen-ext-deck";

it("output files", async () => {
  const gen: AbstractGen = new GenExtDeck(TestHomebrew)
    .setPrebuildDir(`src/lib/gen-ext/gen-ext-deck/prebuild`)
    .setDeckType("my-type")
    .addExtra("my-card", "my-extra")
    .addSubtype("my-card", "my-subtype");

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "assets/Templates/card/my-type/my-source/my-source.json",
    "assets/Textures/card/my-type/my-source/my-source.back.jpg",
    "assets/Textures/card/my-type/my-source/my-source.face.jpg",
  ]);

  const templateData: string | undefined = gen
    ._getOutputFileData(
      "assets/Templates/card/my-type/my-source/my-source.json",
    )
    ?.toString();
  if (!templateData) {
    throw new Error("missing template data");
  }
  const templateJson = JSON.parse(templateData);

  const firstCardMetadata: string | undefined =
    templateJson?.CardMetadata?.["0"];
  if (!firstCardMetadata) {
    throw new Error("missing first card metadata");
  }

  expect(firstCardMetadata).toEqual(
    "card.my-type.my-subtype:my-source/my-card|my-extra",
  );
});
