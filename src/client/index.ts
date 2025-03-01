import { adminSignin, appSignin } from "./signin.js"

export { adminSignin, appSignin } from "./signin.js"

interface BaseClientOptions {
  baseURL: string
}

interface AppClientOptions extends BaseClientOptions {
  name: string
}

export function createAppClient(options: AppClientOptions) {
  return {
    signin: () => appSignin({ baseURL: options.baseURL, name: options.name }),
    signup: () => {},
    resetPassword: () => {},
    forgotPassword: () => {},
  }
}

export function createAdminClient(options: BaseClientOptions) {
  return {
    signin: () => adminSignin({ baseURL: options.baseURL }),
  }
}
