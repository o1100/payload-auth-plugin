import {
  ErrorKind,
  CallbackError,
  SuccessKind,
  CallbackSuccess,
} from "../types.js"

interface BaseOptions {
  baseURL: string
}

interface AppRefreshOptions extends BaseOptions {
  /**
   * This will be the name of then frontend app. Example `app`.
   *
   * It should be same as the name used in the `appAuthPlugin` options.
   */
  name: string
}
export interface ExtendedRefreshOptions {
  onError?: (args: CallbackError) => unknown | undefined
  onSuccess?: (args: CallbackSuccess) => unknown | undefined
}
export async function refresh(
  options: AppRefreshOptions,
  extendedOpts?: ExtendedRefreshOptions,
) {
  const base = options.baseURL
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
