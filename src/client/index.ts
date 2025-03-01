import { adminSignin, appSignin } from "./signin.js"

export { adminSignin, appSignin } from "./signin.js"

interface CreateClientOptions {
  type: "app" | "admin"
  baseURL: string
  name?: string | undefined
}

export function createClient(options: CreateClientOptions) {
  if (options.type === "app") {
    return {
      signin: () =>
        appSignin({ baseURL: options.baseURL, name: options.name ?? "app" }),
      signup: () => {},
      resetPassword: () => {},
      forgotPassword: () => {},
    }
  }
  if (options.type === "admin") {
    return {
      signin: () => adminSignin({ baseURL: options.baseURL }),
    }
  }
  return {}
}
