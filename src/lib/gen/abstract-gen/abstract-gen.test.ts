import { AbstractGen } from "./abstract-gen";

it("output filename", () => {
  const filename: string = AbstractGen._validateFilenameOrThrow(
    "Models/somefile.obj"
  );
  expect(filename).toBe("assets/Models/somefile.obj");
});

it("output filename (invalid second part)", () => {
  expect(() => {
    AbstractGen._validateFilenameOrThrow("Invalid/somefile.obj");
  }).toThrow();
});
