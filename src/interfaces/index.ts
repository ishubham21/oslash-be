import { Shortcut } from "@prisma/client";

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
  email: string;
  createdAt: Date;
  updatedAt: Date;
  shortcuts?: Shortcut;
};

export type ShortcutVisibility = "Workspace" | "Private";

export type ShortcutData = {
  shortlink: string;
  url: string;
  visibility: ShortcutVisibility;
  description?: string;
  tags: string[]
}; 
