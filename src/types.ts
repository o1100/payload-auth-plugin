import type { AuthorizationServer } from "oauth4webapi"

interface BaseProviderConfig {
  id: string
  name: string
  scope: string
  profile: (
    profile: Record<string, string | number | boolean | object>,
  ) => AccountInfo
}

/**
 * Description placeholder
 *
 * @export
 * @interface ProviderConfig
 */
export interface OauthProviderConfig {
  client_id: string
  client_secret?: string
  params?: Record<string, string> | undefined
}

export interface OIDCProviderConfig
  extends BaseProviderConfig,
    OauthProviderConfig {
  issuer: string
  algorithm: "oidc"
}

export interface OAuth2ProviderConfig
  extends BaseProviderConfig,
    OauthProviderConfig {
  authorization_server: AuthorizationServer
  algorithm: "oauth2"
}

export type OAuthProviderConfig = (
  | OIDCProviderConfig
  | OAuth2ProviderConfig
) & {
  kind: "oauth"
}

export interface AccountInfo {
  sub: string
  name: string
  picture: string
  email: string
  passKey?: {
    credentialId: string
    publicKey?: Uint8Array
    counter: number
    transports?: string[]
    deviceType: string
    backedUp: boolean
  }
}

export type CredentialsProviderConfig = {
  id: string
  name: string
  verfiyEmail?: boolean
  passwordless?: boolean
  mfa?: "OTP" | "TOTP" | "None"
  signinCallback?: () => void
  signupCallback?: () => void
}

export interface CredentialsAccountInfo {
  name: string
  email: string
}

export type PasskeyProviderConfig = {
  id: string
  kind: "passkey"
}

export type ProvidersConfig = OAuthProviderConfig | PasskeyProviderConfig
