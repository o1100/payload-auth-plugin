import type * as oauth from "oauth4webapi"
import type {
  OAuth2ProviderConfig,
  AccountInfo,
  OAuthBaseProviderConfig,
} from "../../types.js"

const algorithm = "oauth2"

const authorization_server: oauth.AuthorizationServer = {
  issuer: "https://auth.atlassian.com",
  authorization_endpoint: "https://auth.atlassian.com/authorize",
  token_endpoint: "https://auth.atlassian.com/oauth/token",
  userinfo_endpoint: "https://api.atlassian.com/me",
}

type AtlassianAuthConfig = OAuthBaseProviderConfig

/**
 * Add Atlassian OAuth2 Provider
 *
 * #### Callback or Redirect URL pattern
 *
 * ```
 * https://example.com/api/{name}/oauth/callback/atlassian
 * ```
 *
 * #### Plugin Setup
 *
 * ```ts
 * import { Plugin } from 'payload'
 * import {authPlugin} from "payload-auth-plugin"
 * import {AtlassianAuthProvider} from "payload-auth-plugin/providers"
 *
 * export const plugins: Plugins[] = [
 *  authPlugin({
 *    providers:[
 *      AtlassianAuthProvider({
 *          client_id: process.env.ATLASSIAN_CLIENT_ID as string,
 *          client_secret: process.env.ATLASSIAN_CLIENT_SECRET as string,
 *      })
 *    ]
 *  })
 *
 * ]
 * ```
 *
 */
function AtlassianAuthProvider(
  config: AtlassianAuthConfig,
): OAuth2ProviderConfig {
  const { overrideScope, ...restConfig } = config
  return {
    ...restConfig,
    id: "atlassian",
    authorization_server,
    name: "Atlassian",
    algorithm,
    scope: overrideScope ?? "read:me read:account",
    kind: "oauth",
    profile: (profile): AccountInfo => {
      return {
        sub: profile.account_id as string,
        name: profile.name as string,
        email: profile.email as string,
        picture: profile.picture as string,
      }
    },
  }
}

export default AtlassianAuthProvider
