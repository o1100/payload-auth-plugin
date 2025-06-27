import type {
  AccountInfo,
  OIDCProviderConfig,
  OAuthBaseProviderConfig,
} from "../../types.js"

interface CognitoAuthConfig extends OAuthBaseProviderConfig {
  domain: string
}

/**
 * Add Cognito OIDC Provider
 *
 * #### Callback or Redirect URL pattern
 * ```
 * https://example.com/api/{name}/oauth/callback/cognito
 * ```
 *
 * #### Plugin Setup
 *
 * ```ts
 * import { Plugin } from 'payload'
 * import { authPlugin } from "payload-auth-plugin"
 * import { CognitoAuthProvider } from "payload-auth-plugin/providers"
 *
 * export const plugins: Plugin[] = [
 *  authPlugin({
 *    providers:[
 *      CognitoAuthProvider({
 *        client_id: process.env.COGNITO_CLIENT_ID as string,
 *        client_secret: process.env.COGNITO_CLIENT_SECRET as string,
 *      })
 *    ]
 *  })
 * ]
 * ```
 *
 */

function CognitoAuthProvider(config: CognitoAuthConfig): OIDCProviderConfig {
  const { domain, overrideScope, ...restConfig } = config
  return {
    ...restConfig,
    id: "cognito",
    scope: overrideScope ?? "email openid profile",
    issuer: domain,
    name: "Congnito",
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

export default CognitoAuthProvider
