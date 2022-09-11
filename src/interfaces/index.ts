export type GeneralApiResponse = {
  error: string | null;
  data: object | string | null | any;
};

export type UserRegistrationData = {
  name: string;
  email: string;
  password: string;
};
