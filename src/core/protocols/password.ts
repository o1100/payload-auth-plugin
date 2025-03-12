import { PayloadRequest } from "payload"
import {
  EmailAlreadyExistError,
  InvalidCredentials,
  InvalidRequestBodyError,
  UserNotFoundAPIError,
} from "../errors/apiErrors.js"
import { hashPassword, verifyPassword } from "../utils/password.js"
import { SuccessKind } from "../../types.js"

export async function PasswordSignin(
  request: PayloadRequest,
  internal: {
    usersCollectionSlug: string
  },
  sessionCallBack: (user: { id: string; email: string }) => Promise<Response>,
): Promise<Response> {
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

  if (
    !verifyPassword(
      body.password,
      user["hashedPassword"],
      user["salt"],
      user["hashIterations"],
    )
  ) {
    return new InvalidCredentials()
  }
  return sessionCallBack({
    id: user.id as string,
    email: body.email,
  })
}

export const PasswordSignup = async (
  request: PayloadRequest,
  internal: {
    usersCollectionSlug: string
  },
  sessionCallBack: (user: { id: string; email: string }) => Promise<Response>,
) => {
  const body =
    request.json &&
    ((await request.json()) as {
      email: string
      password: string
      allowAutoSignin?: boolean
      profile?: Record<string, unknown>
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
    salt,
    iterations,
  } = await hashPassword(body.password)

  const user = await payload.create({
    collection: internal.usersCollectionSlug,
    data: {
      email: body.email,
      hashedPassword: hashedPassword,
      hashIterations: iterations,
      salt,
      ...body.profile,
    },
  })

  if (body.allowAutoSignin) {
    return sessionCallBack({
      id: user.id as string,
      email: body.email,
    })
  }

  return Response.json(
    {
      message: "Signed up successfully",
      kind: SuccessKind.Created,
    },
    { status: 201 },
  )
}
