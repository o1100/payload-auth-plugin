import { oauth, OauthProvider, OauthSigninOptions } from "./oauth.js"
import { init as passkeyInit } from "./passkey/index.js"
interface BaseOptions {
  name: string
}

export function appSignin(options: BaseOptions) {
  return {
    oauth: (provider: OauthProvider, oauthSigniOptions?: OauthSigninOptions) =>
      oauth(options, provider, oauthSigniOptions),
    passkey: () => passkeyInit(),
    // credentials: async (payload: any) => {
    //   const base = options.baseURL
    //   await fetch(`${base}/${options.name}/auth/signin`, {
    //     method: "POST",
    //     body: JSON.stringify(payload),
    //   })
    // },
  }
}

export function adminSignin() {
  return {
    oauth: (provider: OauthProvider, oauthSigniOptions?: OauthSigninOptions) =>
      oauth({ name: "admin" }, provider, oauthSigniOptions),
    passkey: () => {
      passkeyInit()
    },
  }
}
