import { Tokens } from "../types";

export class UserRequest {
  fullName: string
  email: string
  tokens: Tokens
  isAdmin: boolean
  isFirstTime: boolean
  newPassword: string
  repeatNewPassword: string
  oldPassword: string
}