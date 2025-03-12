import { CredentialSignupPayload, credentialSignup } from "./credentials.js"

interface BaseOptions {
  name: string
}

export const appSignup = (options: BaseOptions) => {
  return {
    credentials: async (paylaod: CredentialSignupPayload) =>
      await credentialSignup(options, paylaod),
  }
}
