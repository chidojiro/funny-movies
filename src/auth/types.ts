export type LoginPayload = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  password: string;
};

export enum ApiErrors {
  INVALID = 'INVALID',
  ALREADY_EXIST = 'ALREADY_EXIST',
}
