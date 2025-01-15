import { registration } from './passkey'

type Provider = "google" | 'github' | 'passkey'

export function signin(provider: Provider) {
  if (provider === 'passkey') {
    registration()
  } else {
    const link = document.createElement('a')
    link.href = '/api/admin/oauth/authorization/' + provider
    link.click()
  }
}
