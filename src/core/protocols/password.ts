import { getCookieExpiration, parseCookies, type PayloadRequest } from "payload"
import {
  AuthenticationFailed,
  EmailAlreadyExistError,
  InvalidCredentials,
  InvalidRequestBodyError,
  UnauthorizedAPIRequest,
  UserNotFoundAPIError,
} from "../errors/apiErrors.js"
import { hashPassword, verifyPassword } from "../utils/password.js"
import { SuccessKind } from "../../types.js"
import { ephemeralCode, verifyEphemeralCode } from "../utils/hash.js"
import {
  APP_COOKIE_SUFFIX,
  EPHEMERAL_CODE_COOKIE_NAME,
} from "../../constants.js"
import {
  createSessionCookies,
  invalidateOAuthCookies,
  invalidateSessionCookies,
  verifySessionCookie,
} from "../utils/cookies.js"
import { revokeSession } from "../utils/session.js"

export const PasswordSignin = async (
  pluginType: string,
  request: PayloadRequest,
  internal: {
    usersCollectionSlug: string
  },
  useAdmin: boolean,
  secret: string,
) => {
  const body =
    request.json &&
    ((await request.json()) as { email: string; password: string })

  if (!body?.email || !body.password) {
    return new InvalidRequestBodyError()
  }

  const { payload } = request
  const { docs } = await payload.find({
    collection: internal.usersCollectionSlug,
    where: {
      email: { equals: body.email },
    },
    limit: 1,
  })

  if (docs.length !== 1) {
    return new UserNotFoundAPIError()
  }

  const user = docs[0]
  const isVerifed = await verifyPassword(
    body.password,
    user.hashedPassword,
    user.hashSalt,
    user.hashIterations,
  )
  if (!isVerifed) {
    return new InvalidCredentials()
  }

  let cookies: string[] = []

  const cookieName = useAdmin
    ? `${payload.config.cookiePrefix}-token`
    : `__${pluginType}-${APP_COOKIE_SUFFIX}`

  cookies = [
    ...(await createSessionCookies(cookieName, secret, {
      id: user.id,
      email: user.email,
      collection: internal.usersCollectionSlug,
    })),
  ]
  cookies = invalidateOAuthCookies(cookies)
  return Response.json({ data: "signin" })
}

export const PasswordSignup = async (
  request: PayloadRequest,
  internal: {
    usersCollectionSlug: string
  },
) => {
  const body =
    request.json &&
    ((await request.json()) as {
      email: string
      password: string
      allowAutoSignin?: boolean
      userInfo?: Record<string, unknown>
    })

  if (!body?.email || !body.password) {
    return new InvalidRequestBodyError()
  }

  const { payload } = request
  const { docs } = await payload.find({
    collection: internal.usersCollectionSlug,
    where: {
      email: { equals: body.email },
    },
    limit: 1,
  })

  if (docs.length > 0) {
    return new EmailAlreadyExistError()
  }

  const {
    hash: hashedPassword,
    salt: hashSalt,
    iterations,
  } = await hashPassword(body.password)

  const user = await payload.create({
    collection: internal.usersCollectionSlug,
    data: {
      email: body.email,
      hashedPassword: hashedPassword,
      hashIterations: iterations,
      hashSalt,
      ...body.userInfo,
    },
  })

  if (body.allowAutoSignin) {
    return Response.json({ data: "signin" })
  }

  return Response.json(
    {
      message: "Signed up successfully",
      kind: SuccessKind.Created,
      isSuccess: true,
      isError: false,
    },
    { status: 201 },
  )
}

export const ForgotPasswordInit = async (
  request: PayloadRequest,
  internal: {
    usersCollectionSlug: string
  },
) => {
  const { payload } = request

  const body =
    request.json &&
    ((await request.json()) as {
      email: string
    })

  if (!body?.email) {
    return new InvalidRequestBodyError()
  }

  const { docs } = await payload.find({
    collection: internal.usersCollectionSlug,
    where: {
      email: { equals: body.email },
    },
    limit: 1,
  })

  if (docs.length !== 1) {
    return new UserNotFoundAPIError()
  }
  const { code, hash } = await ephemeralCode(6, payload.secret)

  await payload.sendEmail({
    to: body.email,
    subject: "Password recovery",
    text: "Password recovery code: " + code,
  })

  const res = new Response(
    JSON.stringify({
      message: "Password recovery initiated successfully",
      kind: SuccessKind.Created,
      isSuccess: true,
      isError: false,
    }),
    { status: 201 },
  )
  const tokenExpiration = getCookieExpiration({
    seconds: 300,
  })
  res.headers.append(
    "Set-Cookie",
    `${EPHEMERAL_CODE_COOKIE_NAME}=${hash};Path=/;HttpOnly;Secure=true;SameSite=lax;Expires=${tokenExpiration.toUTCString()}`,
  )
  return res
}

export const ForgotPasswordVerify = async (
  request: PayloadRequest,
  internal: {
    usersCollectionSlug: string
  },
) => {
  const { payload } = request

  const body =
    request.json &&
    ((await request.json()) as {
      email: string
      password: string
      code: string
    })

  if (!body?.email || !body?.password || !body.code) {
    return new InvalidRequestBodyError()
  }

  const cookies = parseCookies(request.headers)
  const hash = cookies.get(EPHEMERAL_CODE_COOKIE_NAME)
  if (!hash) {
    return new UnauthorizedAPIRequest()
  }

  const isVerified = await verifyEphemeralCode(body.code, hash, payload.secret)

  if (!isVerified) {
    return new AuthenticationFailed()
  }
  const { docs } = await payload.find({
    collection: internal.usersCollectionSlug,
    where: {
      email: { equals: body.email },
    },
    limit: 1,
  })

  if (docs.length !== 1) {
    return new UserNotFoundAPIError()
  }

  const {
    hash: hashedPassword,
    salt: hashSalt,
    iterations,
  } = await hashPassword(body.password)

  await payload.update({
    collection: internal.usersCollectionSlug,
    id: docs[0].id,
    data: {
      hashedPassword,
      hashSalt,
      hashIterations: iterations,
    },
  })

  const res = new Response(
    JSON.stringify({
      message: "Password recovered successfully",
      kind: SuccessKind.Updated,
      isSuccess: true,
      isError: false,
    }),
    { status: 201 },
  )
  res.headers.append(
    "Set-Cookie",
    `${EPHEMERAL_CODE_COOKIE_NAME}=;Path=/;HttpOnly;Secure=true;SameSite=lax;Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
  )
  return res
}

export const ResetPassword = async (
  cookieName: string,
  secret: string,
  internal: {
    usersCollectionSlug: string
  },
  request: PayloadRequest,
) => {
  const { payload } = request
  const cookies = parseCookies(request.headers)
  const token = cookies.get(cookieName)
  if (!token) {
    return new UnauthorizedAPIRequest()
  }

  const jwtResponse = await verifySessionCookie(token, secret)
  if (!jwtResponse.payload) {
    return new UnauthorizedAPIRequest()
  }

  const body =
    request.json &&
    ((await request.json()) as {
      email: string
      currentPassword: string
      newPassword: string
      signoutOnUpdate?: boolean | undefined
    })

  if (!body?.email || !body?.currentPassword || !body?.newPassword) {
    return new InvalidRequestBodyError()
  }

  const { docs } = await payload.find({
    collection: internal.usersCollectionSlug,
    where: {
      email: { equals: body.email },
    },
    limit: 1,
  })

  if (docs.length !== 1) {
    return new UserNotFoundAPIError()
  }

  const user = docs[0]
  const isVerifed = await verifyPassword(
    body.currentPassword,
    user["hashedPassword"],
    user["hashSalt"],
    user["hashIterations"],
  )
  if (!isVerifed) {
    return new InvalidCredentials()
  }

  const {
    hash: hashedPassword,
    salt: hashSalt,
    iterations,
  } = await hashPassword(body.newPassword)

  await payload.update({
    collection: internal.usersCollectionSlug,
    id: user.id,
    data: {
      hashedPassword,
      hashSalt,
      hashIterations: iterations,
    },
  })

  if (!!body.signoutOnUpdate) {
    let cookies: string[] = []
    cookies = [...invalidateSessionCookies(cookieName, cookies)]
    return revokeSession(cookies)
  }

  const res = new Response(
    JSON.stringify({
      message: "Password reset complete",
      kind: SuccessKind.Updated,
      isSuccess: true,
      isError: false,
    }),
    {
      status: 201,
    },
  )
  return res
}
