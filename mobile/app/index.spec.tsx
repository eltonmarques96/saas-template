// /home/elton/Documentos/Projects/saas-template/mobile/app/index.spec.tsx

describe("Simple math", () => {
  it("should add 2 + 2 and return 4", () => {
    expect(2 + 2).toBe(4);
  });

  it("should not return 5 when adding 2 + 2", () => {
    expect(2 + 2).not.toBe(5);
  });

  it("should return a number when adding 2 + 2", () => {
    expect(typeof (2 + 2)).toBe("number");
  });
});

// We recommend installing an extension to run jest tests.
