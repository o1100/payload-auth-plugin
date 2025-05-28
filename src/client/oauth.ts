import { AuthPluginOutput, ErrorKind } from "../types.js"

type BaseOptions = {
  name: string
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


export const oauth = (
  options: BaseOptions,
  provider: OauthProvider,
  profile?: Record<string, unknown> | undefined,
) => {
  window.location.href = `http://localhost:3000/api/${options.name}/oauth/authorization/${provider}`
}
