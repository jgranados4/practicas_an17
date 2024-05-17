export interface AuthResponse {
  token?: token;
  message?: string;
}

type token = string | null | undefined;
export interface tokenpayload {
  aud?: string;
  email?: string;
  exp?: number;
  iss?: string;
  name?: nombre;
}
type nombre = string|undefined|null;
