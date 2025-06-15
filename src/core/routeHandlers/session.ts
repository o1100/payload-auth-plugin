import type { PayloadRequest } from "payload"
import { InvalidAPIRequest } from "../errors/apiErrors.js"
import { SessionRefresh, SessionUser } from "../protocols/session.js"
import { APP_COOKIE_SUFFIX } from "../../constants.js"

export function SessionHandlers(
  request: PayloadRequest,
  pluginType: string,
  internals: {
    usersCollectionSlug: string
  },
) {
  if (pluginType === "admin") {
    // TODO: Implementation is not necessary as it is already handled by Payload. But can be customised.
    throw new InvalidAPIRequest()
  }

  const kind = request.routeParams?.kind as string

  switch (kind) {
    case "refresh":
      return SessionRefresh(`__${pluginType}-${APP_COOKIE_SUFFIX}`, request)
    case "user":
      return SessionUser(
        `__${pluginType}-${APP_COOKIE_SUFFIX}`,
        request,
        internals,
        [],
      )
    default:
      throw new InvalidAPIRequest()
  }
}
