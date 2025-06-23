import type {
  AccountInfo,
  OIDCProviderConfig,
  OAuthBaseProviderConfig,
} from "../../types.js"

type GitLabAuthConfig = OAuthBaseProviderConfig

/**
 * Add GitLab OIDC Provider
 *
 * #### Callback or Redirect URL pattern
 *
 * ```
 * https://example.com/api/{name}/oauth/callback/gitlab
 * ```
 *
 * #### Plugin Setup
 *
 * ```ts
 * import { Plugin } from 'payload'
 * import { authPlugin } from "payload-auth-plugin"
 * import { GitLabAuthProvider } from "payload-auth-plugin/providers"
 *
 * export const plugins: Plugin[] = [
 *  authPlugin({
 *    providers:[
 *      GitLabAuthProvider({
 *          client_id: process.env.GITLAB_CLIENT_ID as string,
 *          client_secret: process.env.GITLAB_CLIENT_SECRET as string,
 *      })
 *    ]
 *  })
 * ]
 * ```
 *
 */

function GitLabAuthProvider(config: GitLabAuthConfig): OIDCProviderConfig {
  const algorithm = "oidc"
  return {
    ...config,
    id: "gitlab",
    scope: "openid email profile",
    issuer: "https://gitlab.com",
    name: "GitLab",
    algorithm,
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

export default GitLabAuthProvider
