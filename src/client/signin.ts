import { init as passkeyInit } from "./passkey/index.js"

type OauthProvider =
  | "google"
  | "github"
  | "apple"
  | "cognito"
  | "gitlab"
  | "msft-entra"
  | "slack"
  | "atlassian"
  | "auth0"
  | "discord"
  | "facebook"
  | "jumpcloud"

type AppSigninOptions = {
  name: string
  baseURL: string
}

export function appSignin(options: AppSigninOptions) {
  return {
    oauth: (provider: OauthProvider) => {
      const base = options.baseURL
      window.location.href = `${base}/api/${options.name}/oauth/authorization/${provider}`
    },
    passkey: () => {
      passkeyInit()
    },
    credentials: async (payload: any) => {
      const base = options.baseURL
      await fetch(`${base}/${options.name}/auth/signin`, {
        method: "POST",
        body: JSON.stringify(payload),
      })
    },
  }
}

type AdminSigninOptions = {
  baseURL: string
}

export function adminSignin(options: AdminSigninOptions) {
  return {
    oauth: (provider: OauthProvider) => {
      window.location.href = `${options.baseURL}/api/admin/oauth/authorization/${provider}`
    },
    passkey: () => {
      passkeyInit()
    },
  }
}
