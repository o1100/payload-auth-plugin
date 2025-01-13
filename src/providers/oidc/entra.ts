import type { OAuthAccountInfo, OIDCProviderConfig, ProviderConfig } from '../../types'

type EntraAuthConfig = ProviderConfig & {
    tenant_id: string
  }

function EntraAuthProvider(config: EntraAuthConfig): OIDCProviderConfig {
  return {
    ...config,
    id: 'entra',
    scope: 'openid profile email offline_access',
    issuer: `https://login.microsoftonline.com/${config.tenant_id}/v2.0`,
    name: 'Entra',
    algorithm: 'oidc',
    profile: (profile): OAuthAccountInfo => {
      return {
        sub: profile.sub as string,
        name: profile.name as string,
        email: profile.email as string,
        picture: profile.picture as string,
      }
    },
  }
}

export default EntraAuthProvider
