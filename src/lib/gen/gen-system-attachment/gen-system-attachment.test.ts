import { AbstractGen } from "../abstract-gen/abstract-gen";
import { TestHomebrew } from "../../../data/test/test-homebrew";
import { GenSystemAttachment } from "./gen-system-attachment";

it("output files", async () => {
  const gen: AbstractGen = new GenSystemAttachment(TestHomebrew).setPrebuildDir(
    `src/lib/gen/gen-system-attachment/prebuild`
  );

  const errors: Array<string> = [];
  await gen.generate(errors);
  expect(errors).toHaveLength(0);
  expect(gen._getOutputFilenames()).toEqual([
    "Models/token/mirage.col.obj",
    "Models/token/mirage.obj",
    "Models/token/round.col.obj",
    "Models/token/round.obj",
    "Models/token/wormhole-creuss.col.obj",
    "Models/token/wormhole-creuss.obj",
    "Templates/token/attachment/system/my-system-attachment-face-down.json",
    "Templates/token/attachment/system/my-system-attachment.json",
    "Textures/token/attachment/system/my-system-attachment-face-down.back.jpg",
    "Textures/token/attachment/system/my-system-attachment-face-down.jpg",
    "Textures/token/attachment/system/my-system-attachment.jpg",
  ]);
});
