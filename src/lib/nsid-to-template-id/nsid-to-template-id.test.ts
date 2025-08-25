import { nsidToTemplateId } from "./nsid-to-template-id";

it("nsid-to-template-id", () => {
  const result = nsidToTemplateId(`${__dirname}/test-assets`);
  expect(result.split("\n")).toEqual([
    "export const NSID_TO_TEMPLATE_ID: { [key: string]: string } = {",
    '  "card.planet:x/0": "B6F6540523695699C825805068C2F2C2",',
    '  "tile.system:x/1": "489EAA14AFFD549DBD54910333782041"',
    "};",
  ]);
});
