import { redirect } from 'next/navigation'
import { registration } from './passkey'

type Provider = "google" | 'github' | 'passkey'

export function signin(provider: Provider) {
  if (provider === 'passkey') {
    registration()
  } else {
    redirect('/api/admin/oauth/authorization/' + provider)
  }
}
