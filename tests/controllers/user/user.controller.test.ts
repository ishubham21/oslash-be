import UserController from "../../../src/controllers/user/user.controller";

describe("health of user controller", () => {
  let userController: any;

  beforeAll(() => {
    userController = <any>new UserController();
  });

  it("should produce error if user contoller class does not exist", () => {
    expect(userController).toBeTruthy();
  });
});
