import type {
  AccountInfo,
  OIDCProviderConfig,
  ProviderConfig,
} from "../../types.js"

interface KeyCloakAuthConfig extends ProviderConfig {
  realm: string
  domain: string
  identifier: string
  name: string
}

function KeyCloakAuthProvider(config: KeyCloakAuthConfig): OIDCProviderConfig {
  const { realm, domain, identifier, name, ...restConfig } = config
  return {
    ...restConfig,
    id: identifier,
    scope: "email openid profile",
    issuer: `https://${domain}/realms/${realm}`,
    name,
    algorithm: "oidc",
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

export default KeyCloakAuthProvider
