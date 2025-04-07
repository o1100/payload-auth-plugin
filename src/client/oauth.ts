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

export const oauth = (
  options: BaseOptions,
  provider: OauthProvider,
  profile?: Record<string, unknown> | undefined,
): Promise<AuthPluginOutput> => {
  return new Promise((resolve) => {
    const channelId = `oauth_channel_${Math.random().toString(36).substring(2, 15)}`
    const channel = new BroadcastChannel(channelId)

    const cookieName = `oauth_profile`

    const defaultOutput: AuthPluginOutput = {
      message: "Failed to authenticate. Something went wrong",
      kind: ErrorKind.BadRequest,
      data: null,
      isSuccess: false,
      isError: true,
    }

    const base = process.env.NEXT_PUBLIC_SERVER_URL
    const authUrl = `${base}/api/${options.name}/oauth/authorization/${provider}?clientOrigin=${encodeURIComponent(window.location.origin + `#${channelId}`)}`

    if (profile) {
      const encodedData = encodeURIComponent(JSON.stringify(profile))
      document.cookie = `${cookieName}=${encodedData};httpOnly=true;secure=true;path=/;SameSite=Strict;max-age=100`
    }

    const popup = window.open(authUrl, "oauth", `popup`)

    channel.onmessage = async (event) => {
      channel.close()
      document.cookie = `${cookieName}=;path=/;max-age=0`
      if (popup && !popup.closed) popup.close()
      clearTimeout(timeoutId)
      resolve(event.data as AuthPluginOutput)
      return
    }

    const timeoutId = setTimeout(() => {
      if (!popup || popup.closed) {
        channel.close()
        resolve(defaultOutput)
      } else {
        const checkInterval = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkInterval)
            channel.close()
            resolve(defaultOutput)
          }
        }, 1000)

        setTimeout(() => {
          clearInterval(checkInterval)
          channel.close()
          if (popup && !popup.closed) popup.close()
          resolve(defaultOutput)
        }, 120000)
      }
    }, 1000)
  })
}
