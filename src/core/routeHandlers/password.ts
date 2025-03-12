import type { PayloadRequest } from "payload"
import { PasswordSignin, PasswordSignup } from "../protocols/password.js"
import { InvalidAPIRequest } from "../errors/apiErrors.js"

export function PasswordAuthHandlers(
  request: PayloadRequest,
  resource: string,
  internal: {
    usersCollectionSlug: string
  },
  sessionCallBack: (user: { id: string; email: string }) => Promise<Response>,
): Promise<Response> {
  switch (resource) {
    case "signin":
      return PasswordSignin(request, internal, sessionCallBack)
    case "signup":
      return PasswordSignup(request, internal, sessionCallBack)
    default:
      throw new InvalidAPIRequest()
  }
}
