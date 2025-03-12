import { AuthPluginOutput } from "../types.js"
import { BaseClientAppOption } from "./types.js"

interface BaseOptions extends BaseClientAppOption {
  name: string
}

export interface CredentialSigninPayload {
  email: string
  password: string
}
export const credentialSignin = async (
  opts: BaseOptions,
  payload: CredentialSigninPayload,
): Promise<AuthPluginOutput> => {
  const signinResponse = await fetch(`/api/${opts.name}/auth/signin`, {
    method: "POST",
    body: JSON.stringify(payload),
  })

  const { data, message, kind } =
    (await signinResponse.json()) as AuthPluginOutput
  return {
    data,
    message,
    kind,
  }
}

export interface CredentialSignupPayload {
  email: string
  password: string
  allowAutoSignin?: boolean
  profile?: Record<string, unknown>
}

export const credentialSignup = async (
  opts: BaseOptions,
  payload: CredentialSignupPayload,
) => {
  const signupResponse = await fetch(`/api/${opts.name}/auth/signup`, {
    method: "POST",
    body: JSON.stringify(payload),
  })

  const { data, message, kind } =
    (await signupResponse.json()) as AuthPluginOutput
  return {
    data,
    message,
    kind,
  }
}
