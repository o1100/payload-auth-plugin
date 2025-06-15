import { WrongClientUsage } from "../core/errors/consoleErrors.js"
import type { AuthPluginOutput } from "../types.js"

interface BaseOptions {
  name: string
  baseURL: string
}
export const refresh = async (
  options: BaseOptions,
): Promise<AuthPluginOutput> => {
  if (typeof window === "undefined") {
    throw new WrongClientUsage()
  }

  const response = await fetch(
    `${options.baseURL}/api/${options.name}/session/refresh`,
  )
  const { message, kind, data, isError, isSuccess } =
    (await response.json()) as AuthPluginOutput
  return {
    message,
    kind,
    data,
    isError,
    isSuccess,
  }
}
