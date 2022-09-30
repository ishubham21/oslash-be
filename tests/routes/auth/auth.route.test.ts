import AuthRoute from "../../../src/routes/auth/auth.route";

describe("health of user controller", () => {
  let authRoute: any = <any>new AuthRoute();

  it("should produce error if auth route class does not exist", () => {
    expect(authRoute).toBeTruthy();
  });
});
