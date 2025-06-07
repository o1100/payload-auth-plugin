/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import type { AuthPluginOutput, ErrorKind } from "../types.js"

type BaseOptions = {
  name: string
  flow?: 'popup' | 'redirect'
  returnTo?: string
}

type Profile = { [key: string]: unknown }

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
  profile?: Profile,
): void => {
  const flow = options.flow || 'popup'
  const baseUrl = `http://localhost:3000/api/${options.name}/oauth/authorization/${provider}`
  const encodeParam = (str: string): string => {
    let result = ''
    for (let i = 0; i < str.length; i++) {
      const char = str[i]
      if (/[a-zA-Z0-9]/.test(char)) {
        result += char
      } else {
        result += '%' + char.charCodeAt(0).toString(16).padStart(2, '0')
      }
    }
    return result
  }
  const returnTo = options.returnTo ? `?returnTo=${encodeParam(options.returnTo)}` : ''

  if (flow === 'popup') {
    const width = 600
    const height = 700
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    const popup = window.open(
      baseUrl + returnTo,
      'oauth-popup',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    )
    if (!popup) {
      console.error('Popup blocked. Please enable popups or use redirect flow.')
      return
    }
  } else {
    window.location.href = baseUrl + returnTo
  }
}
