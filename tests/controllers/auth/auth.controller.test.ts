describe("validation of registration data", () => {
  describe("name validation", () => {
    test("should produce error if name is not found", () => {
      //
    });

    test("should produce error if name is less than 3 characters", () => {
      //
    });

    test("should produce error if name is greater than 64 characters", () => {
      //
    });
  });

  describe("email validation", () => {
    test("should produce error if email is not found", () => {
      //
    });

    test("should produce error if email is not in correct format", () => {
      //
    });

    test("should produce error if email contains more than 128 characters", () => {
      //
    });
  });

  describe("password validation", () => {
    test("should produce error if password is not found", () => {
      //
    });

    test("should produce error if password is less than 6 characters", () => {
      //
    });

    test("should produce error if password contains more than 256 characters", () => {
      //
    });
  });
});

describe("registraion", () => {
  test("should register the user in the DB", () => {
    //
  });

  test("should not register the user if there is any validation issue", () => {
    //
  });

  test("should not register the user if the user is already in the DB", () => {
    //
  });

  test("should respond with proper status code and error messages", () => {
    //
  });
});
