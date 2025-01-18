import { init } from "./passkey/index.js"

type Provider = "google" | "github" | "passkey"

export function signin(provider: Provider) {
  if (provider === "passkey") {
    init()
  } else {
    const link = document.createElement("a")
    link.href = "/api/admin/oauth/authorization/" + provider
    link.click()
  }
}
