import { credentialSignin, CredentialSigninPayload } from "./credentials.js"
import { oauth, OauthProvider, OauthSigninOptions } from "./oauth.js"
import { init as passkeyInit } from "./passkey/index.js"
interface BaseOptions {
  name: string
}

export const appSignin = (options: BaseOptions) => {
  return {
    oauth: (provider: OauthProvider, oauthSigniOptions?: OauthSigninOptions) =>
      oauth(options, provider, oauthSigniOptions),
    passkey: () => passkeyInit(),
    credentials: async (payload: CredentialSigninPayload) =>
      await credentialSignin(options, payload),
  }
}

export const adminSignin = () => {
  return {
    oauth: (provider: OauthProvider, oauthSigniOptions?: OauthSigninOptions) =>
      oauth({ name: "admin" }, provider, oauthSigniOptions),
    passkey: () => {
      passkeyInit()
    },
  }
}
