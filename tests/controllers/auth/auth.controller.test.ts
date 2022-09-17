describe("validation of registration data", () => {
  describe("name validation", () => {
    it("should produce error if name is not found", () => {
      //
    });

    it("should produce error if name is less than 3 characters", () => {
      //
    });

    it("should produce error if name is greater than 64 characters", () => {
      //
    });
  });

  describe("email validation", () => {
    it("should produce error if email is not found", () => {
      //
    });

    it("should produce error if email is not in correct format", () => {
      //
    });

    it("should produce error if email contains more than 128 characters", () => {
      //
    });
  });

  describe("password validation", () => {
    it("should produce error if password is not found", () => {
      //
    });

    it("should produce error if password is less than 6 characters", () => {
      //
    });

    it("should produce error if password contains more than 256 characters", () => {
      //
    });
  });
});

describe("registraion", () => {
  it("should register the user in the DB", () => {
    //
  });

  it("should not register the user if there is any validation issue", () => {
    //
  });

  it("should not register the user if the user is already in the DB", () => {
    //
  });

  it("should respond with proper status code and error messages", () => {
    //
  });
});
