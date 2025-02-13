import { ProviderAlreadyExists } from "../core/errors/consoleErrors.js"
import {
  ProvidersConfig,
  OAuthProviderConfig,
  PasskeyProviderConfig,
} from "../types.js"

/**
 * Reducer function to extract the OAuth providers
 *
 * @internal
 * @param {ProvidersConfig[]} providers
 * @returns {Record<string, OAuthProviderConfig>}
 */
export function getOAuthProviders(
  providers: ProvidersConfig[],
): Record<string, OAuthProviderConfig> {
  const providerRecords = providers.reduce(
    (
      record: Record<string, OAuthProviderConfig>,
      provider: ProvidersConfig,
    ) => {
      if (record[provider.id]) {
        throw new ProviderAlreadyExists()
      }
      const newRecord = {
        ...record,
      }
      if (provider.kind === "oauth") {
        newRecord[provider.id] = provider
      }
      return newRecord
    },
    {},
  )
  return providerRecords
}

/**
 * Function to get the Passkey provider
 *
 * @export
 * @param {ProvidersConfig[]} providers
 * @returns {(PasskeyProviderConfig | null)}
 */
export function getPasskeyProvider(
  providers: ProvidersConfig[],
): PasskeyProviderConfig | null {
  const passkeyProvider = providers.find(
    (provider) => provider.kind === "passkey",
  )
  if (passkeyProvider) {
    return passkeyProvider
  }
  return null
}
