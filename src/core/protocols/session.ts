import { parseCookies, PayloadRequest } from "payload"
import { UnauthorizedAPIRequest } from "../errors/apiErrors.js"
import { createSessionCookies, verifySessionCookie } from "../utils/cookies.js"
import { SuccessKind } from "../../types.js"

export async function SessionRefresh(
  cookieName: string,
  secret: string,
  request: PayloadRequest,
) {
  const cookies = parseCookies(request.headers)
  const token = cookies.get(cookieName)
  if (!token) {
    return new UnauthorizedAPIRequest()
  }

  const jwtResponse = await verifySessionCookie(token, secret)
  if (!jwtResponse.payload) {
    return new UnauthorizedAPIRequest()
  }
  let refreshCookies: string[] = []
  refreshCookies = [
    ...(await createSessionCookies(cookieName, secret, jwtResponse.payload)),
  ]

  const res = new Response(
    JSON.stringify({ message: "Session refreshed", kind: SuccessKind.Updated }),
    {
      status: 201,
    },
  )
  refreshCookies.forEach((cookie) => {
    res.headers.append("Set-Cookie", cookie)
  })
  return res
}
