import type { AuthPluginOutput } from "../types.js"

interface BaseOptions {
  name: string
  headers: HeadersInit
}

export const getSession = async (
  opts: BaseOptions,
): Promise<AuthPluginOutput> => {
  const response = await fetch(
    `http://localhost:3000/api/${opts.name}/session/user`,
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
