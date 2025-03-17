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

export const oauth = (options: BaseOptions, provider: OauthProvider) => {
  const base = process.env.NEXT_PUBLIC_SERVER_URL
  window.location.href = `${base}/api/${options.name}/oauth/authorization/${provider}`
}
