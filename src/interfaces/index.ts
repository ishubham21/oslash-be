export type GeneralApiResponse = {
  error: string | null | unknown;
  data: object | string | null | any;
};

export type UserRegistrationData = {
  name: string;
  email: string;
  password: string;
};

export interface ServiceError {
  error: null | unknown | string | undefined;
  code: number;
}
