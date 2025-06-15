/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
type BaseOptions = {
  name: string
  baseURL: string
}

export type OauthProvider =
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
  | "twitch"
  | "okta"

export const oauth = (options: BaseOptions, provider: OauthProvider): void => {
  const oauthURL = `${options.baseURL}/api/${options.name}/oauth/authorization/${provider}`
  window.location.href = oauthURL
}
