import { passwordSignin, PasswordSigninPayload } from "./password.js"
import { oauth, OauthProvider } from "./oauth.js"
import { init as passkeyInit } from "./passkey/index.js"
interface BaseOptions {
  name: string
}

export const signin = (options: BaseOptions) => {
  return {
    oauth: async (
      provider: OauthProvider,
      profile?: Record<string, unknown> | undefined,
    ) => await oauth(options, provider, profile),
    passkey: () => passkeyInit(),
    password: async (payload: PasswordSigninPayload) =>
      await passwordSignin(options, payload),
  }
}
