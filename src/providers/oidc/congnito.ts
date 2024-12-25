import type { OAuthAccountInfo, OIDCProviderConfig, ProviderConfig } from '../../types'

type CognitoAuthConfig = {
  domain: string,
  region: string,
} & ProviderConfig

function CognitoAuthProvider(config: CognitoAuthConfig): OIDCProviderConfig {
  const {domain, region, ...restConfig}=config
  return {
    ...restConfig,
    id: 'cognito',
    scope: 'email openid profile',
    issuer: `https://${domain}/${region}`,
    name: 'Congnito',
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

export default CognitoAuthProvider
