import { parseCookies, type PayloadRequest } from "payload"
import {
  UnauthorizedAPIRequest,
  UserNotFoundAPIError,
} from "../errors/apiErrors.js"
import { createSessionCookies, verifySessionCookie } from "../utils/cookies.js"
import { ErrorKind, SuccessKind } from "../../types.js"

export const SessionRefresh = async (
  cookieName: string,
  request: PayloadRequest,
) => {
  const { payload } = request
  const cookies = parseCookies(request.headers)
  const token = cookies.get(cookieName)
  if (!token) {
    return new UnauthorizedAPIRequest()
  }

  const jwtResponse = await verifySessionCookie(token, payload.secret)
  if (!jwtResponse.payload) {
    return new UnauthorizedAPIRequest()
  }
  let refreshCookies: string[] = []
  refreshCookies = [
    ...(await createSessionCookies(
      cookieName,
      payload.secret,
      jwtResponse.payload,
    )),
  ]

  const res = new Response(
    JSON.stringify({
      message: "Session refreshed",
      kind: SuccessKind.Updated,
      isSuccess: true,
      isError: false,
    }),
    {
      status: 201,
    },
  )
  for (const c of refreshCookies) {
    res.headers.append("Set-Cookie", c)
  }

  return res
}

export const SessionUser = async (
  cookieName: string,
  request: PayloadRequest,
  internal: {
    usersCollectionSlug: string
  },
  fields: string[],
) => {
  const { payload } = request

  const cookies = parseCookies(request.headers)
  const token = cookies.get(cookieName)

  if (!token) {
    return new Response(
      JSON.stringify({
        message: "Missing user session",
        kind: ErrorKind.NotAuthenticated,
        data: {},
        isSuccess: false,
        isError: true,
      }),
      {
        status: 403,
      },
    )
  }

  const jwtResponse = await verifySessionCookie(token, payload.secret)
  if (!jwtResponse.payload) {
    return new Response(
      JSON.stringify({
        message: "Invalid user session",
        kind: ErrorKind.NotAuthenticated,
        data: {},
        isSuccess: false,
        isError: true,
      }),
      {
        status: 401,
      },
    )
  }

  const doc = await request.payload.findByID({
    collection: internal.usersCollectionSlug,
    id: jwtResponse.payload.id,
  })
  if (!doc?.id) {
    return new UserNotFoundAPIError()
  }

  return new Response(
    JSON.stringify({
      message: "Fetched user session",
      kind: SuccessKind.Retrieved,
      data: {
        isAuthenticated: true,
        user: {
          id: doc.id,
          email: doc.email,
        },
      },
      isSuccess: true,
      isError: false,
    }),
    {
      status: 200,
    },
  )
}
