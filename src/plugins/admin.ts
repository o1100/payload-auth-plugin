import type { Config, Plugin } from 'payload'
import { EndpointFactory } from '../core/endpoints'
import { OAuthProviderConfig } from '../types'
import { PayloadSession } from '../core/session/payload'
import { InvalidBaseURL, MissingUsersCollection } from '../core/error'
import { buildAccountsCollection } from '../core/collections/admin/accounts'
import { mapProviders } from '../providers/utils'

interface PluginOptions {
  /* Enable or disable plugin
   * @default true
   */
  enabled?: boolean
  /*
   * OAuth Providers
   */
  providers: OAuthProviderConfig[]

  /*
   * Accounts collections slug
   * @default "accounts"
   */
  accountsCollectionSlug?: string
}

export const adminAuthPlugin =
  (pluginOptions: PluginOptions): Plugin =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }

    if (pluginOptions.enabled === false) {
      return config
    }

    if (!process.env.AUTH_BASE_URL) {
      throw new InvalidBaseURL()
    }

    if(!config.admin?.user){
      throw new MissingUsersCollection()
    }

    config.admin = {
      ...(config.admin ?? {}),
    }

    const {
      accountsCollectionSlug = 'accounts',
      providers,
    } = pluginOptions

    const session = new PayloadSession({
      accountsCollectionSlug: accountsCollectionSlug,
      usersCollectionSlug: config.admin.user!,
    })

    const endpoints = new EndpointFactory(mapProviders(providers))

    // Create accounts collection if doesn't exists
    config.collections = [
      ...(config.collections ?? []),
      buildAccountsCollection(accountsCollectionSlug, config.admin.user!),
    ]

    config.endpoints = [
      ...(config.endpoints ?? []),
      ...endpoints.payloadOAuthEndpoints({
        sessionCallback: (oauthAccountInfo, scope, issuerName, basePayload) =>
          session.createSession(oauthAccountInfo, scope, issuerName, basePayload),
      }),
    ]
    return config
  }
