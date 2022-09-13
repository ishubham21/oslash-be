export type GeneralApiResponse = {
  error: string | null | unknown;
  data: object | string | null | any;
};

export type UserRegistrationData = {
  name: string;
  email: string;
  password: string;
};

export type UserLoginData = {
  email: string;
  password: string;
};

export type ServiceError = {
  error: null | unknown | string | undefined;
  code: number;
};

export type UserWithoutPassword = {
  id: string;
  name: string;
  
};
