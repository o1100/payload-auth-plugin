import type {
  AccountInfo,
  OIDCProviderConfig,
  OAuthBaseProviderConfig,
} from "../../types.js"

interface OktaAuthConfig extends OAuthBaseProviderConfig {
  domain: string
}

/**
 * Add Okta OIDC Provider
 *
 * #### Callback or Redirect URL pattern
 *
 * - For Admin
 * ```
 * https://example.com/api/admin/oauth/callback/{name}
 * ```
 *
 * - For App
 * ```
 * https://example.com/api/{app_name}/oauth/callback/{name}
 * ```
 *
 * #### Plugin Setup
 *
 * ```ts
 * import { Plugin } from 'payload'
 * import {adminAuthPlugin, appAuthPlugin} from "payload-auth-plugin"
 * import {OktaAuthProvider} from "payload-auth-plugin/providers"
 *
 * export const plugins: Plugins[] = [
 *  //For Admin
 *  adminAuthPlugin({
 *    accountsCollectionSlug: 'adminAccounts',
 *    providers:[
 *      OktaAuthProvider({g,
 *          domain: process.env.KEYCLOAK_DOMAIN as string,
 *          client_id: process.env.KEYCLOAK_CLIENT_ID as string,
 *          client_secret: process.env.KEYCLOAK_CLIENT_SECRET as string,
 *      })
 *    ]
 *  })
 *
 *  // For App
 *  appAuthPlugin({
 *    name: 'app'
 *    secret: process.env.APP_AUTH_SECRET,
 *    accountsCollectionSlug: 'adminAccounts',
 *    usersCollectionSlug: 'appUsers',
 *    accountsCollectionSlug: 'appAccounts',
 *    providers:[
 *      OktaAuthProvider({
 *          domain: process.env.KEYCLOAK_DOMAIN as string,
 *          client_id: process.env.KEYCLOAK_CLIENT_ID as string,
 *          client_secret: process.env.KEYCLOAK_CLIENT_SECRET as string,
 *      })
 *    ]
 *  })
 * ]
 * ```
 *
 */

function encodeString(s: string): number {
  let h = 0
  const l = s.length
  let i = 0
  if (l > 0) {
    while (i < l) {
      h = ((h << 5) - h + s.charCodeAt(i++)) | 0 // Bitwise operations to create a hash
    }
  }
  return h
}

function OktaAuthProvider(config: OktaAuthConfig): OIDCProviderConfig {
  const { domain, ...restConfig } = config

  const stateCode = encodeString(config.client_id).toString()

  return {
    ...restConfig,
    id: "okta",
    scope: "email openid profile",
    issuer: `https://${domain}`,
    name: "Okta",
    algorithm: "oidc",
    kind: "oauth",
    params: {
      state: `state-${stateCode}`,
    },
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

export default OktaAuthProvider
