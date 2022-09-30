import UserRoute from "../../../src/routes/user/user.route";

describe("health of user controller", () => {
  let userRoute = <any>new UserRoute();

  it("should produce error if user route class does not exist", () => {
    expect(userRoute).toBeTruthy();
  });
});
