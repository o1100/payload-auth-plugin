import { passwordSignin, PasswordSigninPayload } from "./password.js"
import { oauth, OauthProvider } from "./oauth.js"
import { init as passkeyInit } from "./passkey/index.js"
interface BaseOptions {
  name: string
}

export const appSignin = (options: BaseOptions) => {
  return {
    oauth: async (provider: OauthProvider) => await oauth(options, provider),
    passkey: () => passkeyInit(),
    password: async (payload: PasswordSigninPayload) =>
      await passwordSignin(options, payload),
  }
}

export const adminSignin = () => {
  return {
    oauth: async (provider: OauthProvider) =>
      await oauth({ name: "admin" }, provider),
    passkey: () => {
      passkeyInit()
    },
  }
}
