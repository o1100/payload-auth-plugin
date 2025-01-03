import type { BasePayload, Endpoint, PayloadRequest } from 'payload'
import type { OAuthAccountInfo, OAuthProviderConfig, ProvidersConfig } from '../types'
import { OAuthHandlers } from './routeHandlers/oauth'
import { PasskeyHandlers } from './routeHandlers/passkey'

export class EndpointFactory {
  readonly #providers: Record<string, ProvidersConfig>
  readonly #payloadOAuthPath: string = '/admin/oauth/:resource/:provider'
  readonly #payloadPasskeyPath: string = '/admin/passkey/:resource'
  constructor(providers: Record<string, ProvidersConfig>) {
    this.#providers = providers
  }
  payloadOAuthEndpoints({
    sessionCallback,
  }: {
    sessionCallback: (
      oauthAccountInfo: OAuthAccountInfo,
      scope: string,
      issuerName: string,
      payload: BasePayload,
    ) => Promise<Response>
  }): Endpoint[] {
    return [
      {
        path: this.#payloadOAuthPath,
        method: 'get',
        handler: (request: PayloadRequest) => {
          const provider = this.#providers[
            request.routeParams?.provider as string
          ] as OAuthProviderConfig

          return OAuthHandlers(
            request,
            request.routeParams?.resource as string,
            provider,
            oauthAccountInfo => {
              return sessionCallback(
                oauthAccountInfo,
                provider.scope,
                provider.name,
                request.payload,
              )
            },
          )
        },
      },
    ]
  }
  payloadPasskeyEndpoints({
    rpID
  }: {
    rpID: string
  }): Endpoint[] {
    return [
      {
        path: this.#payloadPasskeyPath,
        method: 'get',
        handler: (request: PayloadRequest) => {
          return PasskeyHandlers(
            request,
            request.routeParams?.resource as string,
            rpID,
          )
        },
      },
      {
        path: this.#payloadPasskeyPath,
        method: 'post',
        handler: (request: PayloadRequest) => {
          return PasskeyHandlers(
            request,
            request.routeParams?.resource as string,
            rpID
          )
        },
      },
    ]
  }
}
