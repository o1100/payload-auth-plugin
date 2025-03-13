import type { PayloadRequest } from "payload"
import {
  ForgotPasswordInit,
  ForgotPasswordVerify,
  PasswordSignin,
  PasswordSignup,
} from "../protocols/password.js"
import { InvalidAPIRequest } from "../errors/apiErrors.js"

export function PasswordAuthHandlers(
  request: PayloadRequest,
  kind: string,
  internal: {
    usersCollectionSlug: string
  },
  sessionCallBack: (user: { id: string; email: string }) => Promise<Response>,
  stage?: string | undefined,
): Promise<Response> {
  switch (kind) {
    case "signin":
      return PasswordSignin(request, internal, sessionCallBack)
    case "signup":
      return PasswordSignup(request, internal, sessionCallBack)
    case "forgot-password":
      switch (stage) {
        case "init":
          return ForgotPasswordInit(request, internal)
        case "verify":
          return ForgotPasswordVerify(request, internal)
        default:
          throw new InvalidAPIRequest()
      }
    default:
      throw new InvalidAPIRequest()
  }
}
