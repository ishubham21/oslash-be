import ShortcutsRoute from "../../../src/routes/shortcuts/shortcuts.route";

describe("health of user controller", () => {
  let shortcutsRoute: any = <any>new ShortcutsRoute();

  it("should produce error if shortcut route class does not exist", () => {
    expect(shortcutsRoute).toBeTruthy();
  });
});
