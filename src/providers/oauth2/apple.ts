import { AuthorizationServer } from "oauth4webapi"
import type {
  AccountInfo,
  OAuth2ProviderConfig,
  ProviderConfig,
} from "../../types"

type AppleAuthConfig = ProviderConfig

const algorithm = "oauth2"

const authorization_server: AuthorizationServer = {
  issuer: "https://appleid.apple.com",
  authorization_endpoint: "https://appleid.apple.com/auth/authorize",
  token_endpoint: "https://appleid.apple.com/auth/token",
}

function AppleOAuth2Provider(config: AppleAuthConfig): OAuth2ProviderConfig {
  return {
    ...config,
    id: "apple",
    scope: "name email",
    authorization_server,
    name: "Apple",
    algorithm,
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
