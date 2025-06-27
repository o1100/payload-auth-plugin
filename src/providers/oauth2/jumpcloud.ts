import type * as oauth from "oauth4webapi"
import type {
  AccountInfo,
  OAuthBaseProviderConfig,
  OAuth2ProviderConfig,
} from "../../types.js"

const authorization_server: oauth.AuthorizationServer = {
  issuer: "https://oauth.id.jumpcloud.com/",
  authorization_endpoint: "https://oauth.id.jumpcloud.com/oauth2/auth",
  token_endpoint: "https://oauth.id.jumpcloud.com/oauth2/token",
  userinfo_endpoint: "https://oauth.id.jumpcloud.com/userinfo",
}

type JumpCloudAuthConfig = OAuthBaseProviderConfig

/**
 * Add Jump Cloud OAuth2 Provider
 *
 * #### Callback or Redirect URL pattern
 *
 * ```
 * https://example.com/api/{name}/oauth/callback/jumpcloud
 * ```
 *
 * #### Plugin Setup
 *
 * ```ts
 * import { Plugin } from 'payload'
 * import {authPlugin} from "payload-auth-plugin"
 * import {JumpCloudAuthProvider} from "payload-auth-plugin/providers"
 *
 * export const plugins: Plugin[] = [
 *  authPlugin({
 *    providers:[
 *      JumpCloudAuthProvider({
 *          client_id: process.env.JUMP_CLOUD_CLIENT_ID as string,
 *          client_secret: process.env.JUMP_CLOUD_CLIENT_SECRET as string,
 *      })
 *    ]
 *  })
 * ]
 */

function JumpCloudAuthProvider(
  config: JumpCloudAuthConfig,
): OAuth2ProviderConfig {
  const { overrideScope, ...restConfig } = config

  return {
    ...restConfig,
    id: "jumpcloud",
    scope: overrideScope ?? "openid email profile",
    authorization_server,
    name: "Jump Cloud",
    algorithm: "oauth2",
    kind: "oauth",
    profile: (profile): AccountInfo => {
      return {
        sub: profile.email as string,
        name: profile.name as string,
        email: profile.email as string,
        picture: profile.picture as string,
      }
    },
  }
}

export default JumpCloudAuthProvider
