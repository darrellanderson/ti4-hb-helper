import { generate } from "./generate";

it("generate", async () => {
  await generate({
    sourceAndPackageId: {
      source: "test",
      packageId: "test-package-id",
    },
  });
});
