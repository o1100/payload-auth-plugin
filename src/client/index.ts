import { MissingEnv } from "../core/errors/consoleErrors.js"
import { ExtendedRefreshOptions, refresh } from "./refresh.js"
import { adminSignin, appSignin } from "./signin.js"

interface AppClientOptions {
  name: string
}

export function appClient(options: AppClientOptions) {
  if (!process.env.NEXT_PUBLIC_PAYLOAD_AUTH_URL) {
    throw new MissingEnv("NEXT_PUBLIC_PAYLOAD_AUTH_URL")
  }
  return {
    signin: () => appSignin(options),
    signup: () => {},
    resetPassword: () => {},
    forgotPassword: () => {},
    refresh: async (extOpts?: ExtendedRefreshOptions) =>
      await refresh(options, extOpts),
  }
}

export function adminClient() {
  return {
    signin: () => adminSignin(),
  }
}
