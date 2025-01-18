import { ProviderAlreadyExists } from "../core/errors/consoleErrors"
import { ProvidersConfig } from "../types"

export function mapProviders(providers: ProvidersConfig[]) {
  const providerRecords = providers.reduce(
    (record: Record<string, ProvidersConfig>, provider: ProvidersConfig) => {
      if (record[provider.id]) {
        throw new ProviderAlreadyExists()
      }
      const newRecord = {
        ...record,
        [provider.id]: provider,
      }
      return newRecord
    },
    {},
  )
  return providerRecords
}
