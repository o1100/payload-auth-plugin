import { AuthPluginOutput } from "../types.js"

interface BaseOptions {
  name: string
}

export interface PasswordSigninPayload {
  email: string
  password: string
}
export const passwordSignin = async (
  opts: BaseOptions,
  payload: PasswordSigninPayload,
): Promise<AuthPluginOutput> => {
  const response = await fetch(`/api/${opts.name}/auth/signin`, {
    method: "POST",
    body: JSON.stringify(payload),
  })

  const { data, message, kind } = (await response.json()) as AuthPluginOutput
  return {
    data,
    message,
    kind,
  }
}

export interface PasswordSignupPayload {
  email: string
  password: string
  allowAutoSignin?: boolean
  profile?: Record<string, unknown>
}

export const passwordSignup = async (
  opts: BaseOptions,
  payload: PasswordSignupPayload,
) => {
  const response = await fetch(`/api/${opts.name}/auth/signup`, {
    method: "POST",
    body: JSON.stringify(payload),
  })

  const { data, message, kind } = (await response.json()) as AuthPluginOutput
  return {
    data,
    message,
    kind,
  }
}
