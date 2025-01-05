import { parseCookies, PayloadRequest } from 'payload'
import {
  generateRegistrationOptions,
  GenerateRegistrationOptionsOpts,
  RegistrationResponseJSON,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'
import { EmailNotFoundAPIError, MissingEmailAPIError } from '../errors/apiErrors'
import { MissingOrInvalidSession } from '../errors/consoleErrors'

export async function GeneratePasskeyRegistration(
  request: PayloadRequest,
  rpID: string,
): Promise<Response> {
  // @ts-expect-error TODO: Fix undefined object method
  const { data } = await request.json() as { data: { email: string } }

  if (!data.email) {
    throw new MissingEmailAPIError()
  }

  const user = await request.payload.count({
    collection: request.payload.config.admin.user,
    where: {
      email: {
        equals: data.email,
      },
    },
  })
  if (user.totalDocs !== 1) {
    throw new EmailNotFoundAPIError()
  }

  const registrationOptions: GenerateRegistrationOptionsOpts = {
    rpName: "Payload Passkey Webauth",
    rpID,
    userName: data.email,
    timeout: 60000,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'required',
    },
    supportedAlgorithmIDs: [-7, -257],
  }
  const options = await generateRegistrationOptions(registrationOptions)
  const cookieMaxage = new Date(Date.now() + 300 * 1000)
  const cookies: string[] = []
  cookies.push(
    `__session-webpk-challenge=${options.challenge};Path=/;HttpOnly;SameSite=lax;Expires=${cookieMaxage.toString()}`,
  )
  const res = new Response(JSON.stringify({ options }), { status: 201 })
  cookies.forEach(cookie => {
    res.headers.append('Set-Cookie', cookie)
  })
  return res
}

export async function VerifyPasskeyRegistration(request: PayloadRequest,
  rpID: string): Promise<Response> {
  try {
    const parsedCookies = parseCookies(request.headers)

    const challenge = parsedCookies.get('__session-webpk-challenge')
    if (!challenge) {
      throw new MissingOrInvalidSession()
    }
    // @ts-expect-error TODO: Fix undefined object method
    const body = await request.json() as RegistrationResponseJSON
    let verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });
    return Response.json({ verification })
  } catch (error) {
    console.error(error);
    return Response.json({})
  }
}