import type { AccountInfo, OIDCProviderConfig, ProviderConfig } from '../../types'

type AppleAuthConfig = ProviderConfig

function AppleAuthProvider(config: AppleAuthConfig): OIDCProviderConfig {
    return {
        ...config,
        id: 'apple',
        scope: 'name email',
        issuer: 'https://appleid.apple.com',
        name: 'Apple',
        algorithm: 'oidc',
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

export default AppleAuthProvider
