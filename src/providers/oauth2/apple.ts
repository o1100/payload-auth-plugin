import type { AuthorizationServer } from "oauth4webapi"
import type {
  AccountInfo,
  OAuth2ProviderConfig,
  OAuthBaseProviderConfig,
} from "../../types.js"

type AppleAuthConfig = OAuthBaseProviderConfig

const algorithm = "oauth2"

const authorization_server: AuthorizationServer = {
  issuer: "https://appleid.apple.com",
  authorization_endpoint: "https://appleid.apple.com/auth/authorize",
  token_endpoint: "https://appleid.apple.com/auth/token",
}

/**
 * Add Apple OAuth2 Provider
 *
 * #### Callback or Redirect URL pattern
 *
 * ```
 * https://example.com/api/{name}/oauth/callback/apple
 * ```
 *
 * #### Plugin Setup
 *
 * ```ts
 * import { Plugin } from 'payload'
 * import {authPlugin} from "payload-auth-plugin"
 * import {AppleOAuth2Provider} from "payload-auth-plugin/providers"
 *
 * export const plugins: Plugin[] = [
 *  authPlugin({
 *    providers:[
 *      AppleOAuth2Provider({
 *          client_id: process.env.APPLE_CLIENT_ID as string,
 *          client_secret: process.env.APPLE_CLIENT_SECRET as string,
 *      })
 *    ]
 *  })
 *
 * ]
 * ```
 *
 */

function AppleOAuth2Provider(config: AppleAuthConfig): OAuth2ProviderConfig {
  return {
    ...config,
    id: "apple",
    scope: "name email",
    authorization_server,
    name: "Apple",
    algorithm,
    params: {
      ...config.params,
      response_mode: "form_post",
    },
    kind: "oauth",
    profile: (profile): AccountInfo => {
      return {
        sub: profile.sub as string,
        name: profile.name as string,
        email: profile.email as string,
        picture: profile.picture as string,
      }
    },
  }
}

export default AppleOAuth2Provider
