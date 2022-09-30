import ShortcutsController from "../../../src/controllers/shortcuts/shortcuts.controller";

describe("shortlink validation", () => {
  let shortcutsController: any;

  beforeAll(() => {
    shortcutsController = <any>new ShortcutsController();
  });

  it("should produce error if shortlink is not found", () => {
    const shortcutData = {
      url: "https://github.com",
    };

    const validationResult = shortcutsController.validateShortcutData(
      shortcutData,
    );

    expect(validationResult.error.message).toBe(
      '"shortlink" is required',
    );
  });
});

describe("url validation", () => {
  let shortcutsController: any;

  beforeAll(() => {
    shortcutsController = <any>new ShortcutsController();
  });

  it("should produce error if shortlink is not found", () => {
    const shortcutData = {
      shortlink: "https://github.com",
    };

    const validationResult = shortcutsController.validateShortcutData(
      shortcutData,
    );

    expect(validationResult.error.message).toBe('"url" is required');
  });
});

describe("check if url is WHATWG compliant", () => {
  let shortcutsController: any;

  beforeAll(() => {
    shortcutsController = <any>new ShortcutsController();
  });

  it("the url should be WHATWG compliant", () => {
    const url = "hello";
    expect(shortcutsController.isUrlWhatwgCompliant(url)).toBeFalsy();
  });
});
