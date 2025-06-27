import type {
  AccountInfo,
  OAuthBaseProviderConfig,
  OIDCProviderConfig,
} from "../../types.js"

interface AppleAuthConfig extends OAuthBaseProviderConfig {
  client_id: string
  params?: Record<string, string>
}

/**
 * Add Apple OIDC Provider
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
 * import { authPlugin } from "payload-auth-plugin"
 * import { AppleOIDCAuthProvider } from "payload-auth-plugin/providers"
 *
 * export const plugins: Plugin[] = [
 *  authPlugin({
 *    providers:[
 *      AppleOIDCAuthProvider({
 *          client_id: process.env.APPLE_CLIENT_ID as string,
 *      })
 *    ]
 *  })
 * ```
 *
 */

function AppleOIDCAuthProvider(config: AppleAuthConfig): OIDCProviderConfig {
  const { overrideScope, ...restConfig } = config
  return {
    ...restConfig,
    id: "apple",
    scope: overrideScope ?? "openid name email",
    issuer: "https://appleid.apple.com",
    name: "Apple",
    algorithm: "oidc",
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

export default AppleOIDCAuthProvider
