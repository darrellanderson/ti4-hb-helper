import { getGuid } from "./guid";

it("getGuid", () => {
  const guid = getGuid("test");
  expect(guid).toMatch(/^[0-9A-F]{32}$/);
});
