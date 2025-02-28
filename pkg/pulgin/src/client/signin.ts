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

type AppSigninOptions = {
  name: string
  customEndpointBase?: string
}

export const appSignin = {
  oauth: (options: AppSigninOptions & { provider: OauthProvider }) => {
    const link = document.createElement("a")
    const base = options.customEndpointBase ?? "/api"
    link.href = `${base}/${options.name}/oauth/authorization/${options.provider}`
    link.click()
  },
  passkey: () => {
    passkeyInit()
  },
  credentials: async (payload: any, options: AppSigninOptions) => {
    const base = options.customEndpointBase ?? "/api"
    await fetch(`http://localhost:3000/${base}/${options.name}/auth/signin`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
}

type AdminSigninOptions = {
  customEndpointBase?: string
}

export const adminSignin = {
  oauth: (options: AdminSigninOptions & { provider: OauthProvider }) => {
    const link = document.createElement("a")
    const base = options.customEndpointBase ?? "/api"
    link.href = `${base}/admin/oauth/authorization/${options.provider}`
    link.click()
  },
  passkey: () => {
    passkeyInit()
  },
}
