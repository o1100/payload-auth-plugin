'use client'

import { appClient } from 'payload-auth-plugin/client'

const { signin } = appClient({ name: 'app' })

export const handleOauthSignin = (provider: 'google' | 'github') => {
  signin().oauth(provider)
}
