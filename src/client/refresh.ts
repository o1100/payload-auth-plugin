import {
  ErrorKind,
  CallbackError,
  SuccessKind,
  CallbackSuccess,
} from "../types.js"

interface BaseOptions {
  name: string
}
export interface ExtendedRefreshOptions {
  onError?: (args: CallbackError) => unknown | undefined
  onSuccess?: (args: CallbackSuccess) => unknown | undefined
}
export async function refresh(
  options: BaseOptions,
  extendedOpts?: ExtendedRefreshOptions,
) {
  const base = process.env.NEXT_PUBLIC_PAYLOAD_AUTH_URL
  const response = await fetch(`${base}/api/${options.name}/session/refresh`)
  const message = await response.json()
  if (!response.ok) {
    if (extendedOpts?.onError) {
      // TODO fix the logic
      extendedOpts.onError({ message, kind: ErrorKind.Unauthorized })
      return
    }
  }
  if (extendedOpts?.onSuccess) {
    extendedOpts?.onSuccess({ message, kind: SuccessKind.Created })
  }
  return
}
