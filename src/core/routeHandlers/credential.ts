import type { PayloadRequest } from "payload"
import { CredentialSignin, CredentialSignup } from "../protocols/credentials.js"
import { InvalidAPIRequest } from "../errors/apiErrors.js"

export function CredentialsHandlers(
  request: PayloadRequest,
  resource: string,
  internal: {
    usersCollectionSlug: string
  },
  sessionCallBack: (user: { id: string; email: string }) => Promise<Response>,
): Promise<Response> {
  switch (resource) {
    case "signin":
      return CredentialSignin(request, internal, sessionCallBack)
    case "signup":
      return CredentialSignup(request, internal, sessionCallBack)
    default:
      throw new InvalidAPIRequest()
  }
}
