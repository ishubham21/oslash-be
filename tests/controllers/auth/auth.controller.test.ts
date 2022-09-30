import AuthController from "../../../src/controllers/auth/auth.controller";

describe("validation of registration data", () => {
  describe("name validation", () => {
    let authController: any;

    beforeAll(() => {
      authController = <any>new AuthController();
    });

    it("should produce error if name is not found", () => {
      const userRegistrationData = {
        email: "sg2199203@gmail.com",
        password: "randompassword",
      };

      const validationResult = authController.validateRegistrationData(
        userRegistrationData,
      );

      expect(validationResult.error.message).toBe(
        '"name" is required',
      );
    });

    it("should produce error if name is less than 3 characters", () => {
      const userRegistrationData = {
        name: "sh",
        email: "sg2199203@gmail.com",
        password: "randompassword",
      };

      const validationResult = authController.validateRegistrationData(
        userRegistrationData,
      );

      expect(validationResult.error.message).toBe(
        '"name" length must be at least 3 characters long',
      );
    });

    it("should produce error if name is greater than 64 characters", () => {
      const userRegistrationData = {
        name:
          "1234567891011121314151617181920212223242526272829303132333435363738394041424344454647484950",
        email: "sg2199203@gmail.com",
        password: "randompassword",
      };

      const validationResult = authController.validateRegistrationData(
        userRegistrationData,
      );

      expect(validationResult.error.message).toBe(
        '"name" length must be less than or equal to 64 characters long',
      );
    });
  });

  describe("email validation", () => {
    let authController: any;

    beforeAll(() => {
      authController = <any>new AuthController();
    });

    it("should produce error if email is not found", () => {
      const userRegistrationData = {
        name: "shubham",
        password: "randompassword",
      };

      const validationResult = authController.validateRegistrationData(
        userRegistrationData,
      );

      expect(validationResult.error.message).toBe(
        '"email" is required',
      );
    });

    it("should produce error if email is not in correct format", () => {
      const userRegistrationData = {
        name: "shubham",
        email: "shubham",
        password: "randompassword",
      };

      const validationResult = authController.validateRegistrationData(
        userRegistrationData,
      );

      expect(validationResult.error.message).toBe(
        '"email" must be a valid email',
      );
    });
  });

  describe("password validation", () => {
    let authController: any;

    beforeAll(() => {
      authController = <any>new AuthController();
    });

    it("should produce error if password is not found", () => {
      const userRegistrationData = {
        name: "shubham",
        email: "shubham@gmail.com",
      };

      const validationResult = authController.validateRegistrationData(
        userRegistrationData,
      );

      expect(validationResult.error.message).toBe(
        '"password" is required',
      );
    });

    it("should produce error if password is less than 6 characters", () => {
      const userRegistrationData = {
        name: "shubham",
        email: "sg2199203@gmail.com",
        password: "rand",
      };

      const validationResult = authController.validateRegistrationData(
        userRegistrationData,
      );

      expect(validationResult.error.message).toBe(
        '"password" length must be at least 6 characters long',
      );
    });
  });
});
