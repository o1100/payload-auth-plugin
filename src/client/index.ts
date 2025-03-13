import { MissingEnv } from "../core/errors/consoleErrors.js"
import {
  forgotPassword,
  ForgotPasswordPayload,
  passwordRecover,
  PasswordRecoverPayload,
} from "./password.js"
import { refresh } from "./refresh.js"
import { adminSignin, appSignin } from "./signin.js"
import { appSignup } from "./signup.js"

interface AppClientOptions {
  name: string
}

export const appClient = (options: AppClientOptions) => {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) {
    throw new MissingEnv("NEXT_PUBLIC_SERVER_URL")
  }
  return {
    signin: () => appSignin(options),
    signup: () => appSignup(options),
    resetPassword: () => {},
    forgotPassword: async (payload: ForgotPasswordPayload) =>
      await forgotPassword(options, payload),
    passwordRecover: async (payload: PasswordRecoverPayload) =>
      await passwordRecover(options, payload),
    refresh: async () => await refresh(options),
  }
}

export const adminClient = () => {
  return {
    signin: () => adminSignin(),
  }
}
