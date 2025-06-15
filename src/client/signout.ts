import { WrongClientUsage } from "../core/errors/consoleErrors.js"
import { SuccessKind, type AuthPluginOutput } from "../types.js"
import * as qs from "qs-esm"

interface BaseOptions {
  name: string
  returnTo?: string | undefined
  baseURL: string
}

export const signout = async (opts: BaseOptions) => {
  if (typeof window === "undefined") {
    throw new WrongClientUsage()
  }
  const query: Record<string, string> = {}
  if (opts.returnTo) {
    query.returnTo = opts.returnTo
  }

  const response = await fetch(
    `${opts.baseURL}/api/${opts.name}/session/signout?${qs.stringify(query)}`,
  )
  if (response.redirected) {
    window.location.href = response.url
    return {
      data: {},
      message: "Signing out...",
      kind: SuccessKind.Deleted,
      isError: false,
      isSuccess: true,
    }
  }
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
