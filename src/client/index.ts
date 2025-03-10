import { MissingEnv } from "../core/errors/consoleErrors.js"
import { ExtendedRefreshOptions, refresh } from "./refresh.js"
import { adminSignin, appSignin } from "./signin.js"
interface BaseClientOptions {}

interface AppClientOptions extends BaseClientOptions {
  name: string
}

export function appClient(options: AppClientOptions) {
  if (!process.env.NEXT_PUBLIC_PAYLOAD_AUTH_URL) {
    throw new MissingEnv("NEXT_PUBLIC_PAYLOAD_AUTH_URL")
  }
  const baseURL = process.env.NEXT_PUBLIC_PAYLOAD_AUTH_URL
  return {
    signin: () => appSignin({ baseURL, ...options }),
    signup: () => {},
    resetPassword: () => {},
    forgotPassword: () => {},
    refresh: async (extOpts?: ExtendedRefreshOptions) =>
      await refresh({ baseURL, ...options }, extOpts),
  }
}

export function adminClient(options: BaseClientOptions) {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) {
    throw new MissingEnv("NEXT_PUBLIC_SERVER_URL")
  }
  const baseURL = process.env.NEXT_PUBLIC_SERVER_URL
  return {
    signin: () => adminSignin({ baseURL, ...options }),
  }
}
