import { WrongClientUsage } from "../core/errors/consoleErrors.js"
import type { AuthPluginOutput } from "../types.js"

interface BaseOptions {
  name: string
  headers: HeadersInit
  baseURL: string
}

export const getSession = async (
  opts: BaseOptions,
): Promise<AuthPluginOutput> => {
  const response = await fetch(
    `${opts.baseURL}/api/${opts.name}/session/user`,
    {
      method: "GET",
      headers: opts.headers,
    },
  )
  const { data, message, kind, isError, isSuccess } =
    (await response.json()) as AuthPluginOutput
  return {
    data,
    message,
    kind,
    isError,
    isSuccess,
  }
}

export const getClientSession = async (
  opts: Pick<BaseOptions, "name" | "baseURL">,
) => {
  if (typeof window === "undefined") {
    throw new WrongClientUsage()
  }

  const response = await fetch(`${opts.baseURL}/api/${opts.name}/session/user`)
  const { data, message, kind, isError, isSuccess } =
    (await response.json()) as AuthPluginOutput
  return {
    data,
    message,
    kind,
    isError,
    isSuccess,
  }
}
