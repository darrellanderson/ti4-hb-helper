import { nsidNameToName } from "./nsid-name-to-name";

it("nsid-name-to-name", () => {
  const name: string = nsidNameToName("my-name-of-foo");
  expect(name).toBe("My Name of Foo");
});
