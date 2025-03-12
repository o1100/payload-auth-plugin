import { PayloadRequest } from "payload"
import {
  EmailAlreadyExistError,
  InvalidRequestBodyError,
} from "../errors/apiErrors.js"
import { hashPassword } from "../utils/password.js"
import { SuccessKind } from "../../types.js"
import { createSessionCookies } from "../utils/cookies.js"

export async function CredentialSignin(
  request: PayloadRequest,
): Promise<Response> {
  const body = request.json && ((await request.json()) as { email: string })

  return Response.json({})
}

export const CredentialSignup = async (
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

  const { hash: hashedPassword, salt } = await hashPassword(body.password)

  const user = await payload.create({
    collection: internal.usersCollectionSlug,
    data: {
      email: body.email,
      hashedPassword: hashedPassword,
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
