import { Tokens } from "../types";

export class UserResponse {
  fullName: string
  email: string
  tokens: Tokens
  isAdmin: boolean
}