import { parseCookies, PayloadRequest } from 'payload'
import {
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
  generateAuthenticationOptions,
  GenerateAuthenticationOptionsOpts,
  generateRegistrationOptions,
  GenerateRegistrationOptionsOpts,
  RegistrationResponseJSON,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'
import { EmailNotFoundAPIError, MissingEmailAPIError, PasskeyVerificationAPIError } from '../errors/apiErrors'
import { MissingOrInvalidSession } from '../errors/consoleErrors'
import { AccountInfo } from '../../types'
import { hashCode } from '../utils/hash'

export async function InitPasskey(
  request: PayloadRequest
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

  const existingRecord = await request.payload.find({
    collection: 'accounts',
    where: {
      sub: {
        equals: hashCode(data.email + request.payload.secret).toString(),
      }
    }
  })
  if (existingRecord.totalDocs !== 1) {
    return new Response(JSON.stringify({ data: {} }), { status: 200 })
  }
  return new Response(JSON.stringify({ data: existingRecord.docs[0] }), { status: 200 })
}

export async function GeneratePasskeyRegistration(
  request: PayloadRequest,
  rpID: string,
): Promise<Response> {
  // @ts-expect-error TODO: Fix undefined object method
  const { data } = await request.json() as { data: { email: string } }

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

export async function VerifyPasskeyRegistration(
  request: PayloadRequest,
  rpID: string,
  session_callback: (accountInfo: AccountInfo) => Promise<Response>,
): Promise<Response> {
  try {
    const parsedCookies = parseCookies(request.headers)

    const challenge = parsedCookies.get('__session-webpk-challenge')
    if (!challenge) {
      throw new MissingOrInvalidSession()
    }
    // @ts-expect-error TODO: Fix undefined object method
    const body = await request.json() as { data: { email: string, registration: RegistrationResponseJSON } }
    const verification = await verifyRegistrationResponse({
      response: body.data.registration,
      expectedChallenge: challenge,
      expectedOrigin: request.payload.config.serverURL,
      expectedRPID: rpID,
    });
    if (!verification.verified) {
      throw new PasskeyVerificationAPIError()
    }
    const { credential,
      credentialDeviceType,
      credentialBackedUp, } = verification.registrationInfo!;

    return await session_callback({
      sub: hashCode(body.data.email + request.payload.secret).toString(),
      name: '',
      picture: '',
      email: body.data.email,
      passKey: {
        credentialId: credential.id,
        publicKey: credential.publicKey,
        counter: credential.counter,
        transports: credential.transports!,
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp
      }
    })
  } catch (error) {
    console.error(error);
    return Response.json({})
  }
}

export async function GeneratePasskeyAuthentication(
  request: PayloadRequest,
  rpID: string,
): Promise<Response> {
  // @ts-expect-error TODO: Fix undefined object method
  const { data } = await request.json() as {
    data: {
      passkey: {
        backedUp: boolean,
        counter: 0,
        credentialId: string,
        deviceType: string,
        publicKey: Uint8Array,
        transports: AuthenticatorTransportFuture[]
      }
    }
  }

  const registrationOptions: GenerateAuthenticationOptionsOpts = {
    rpID,
    timeout: 60000,
    allowCredentials: [{
      id: data.passkey.credentialId,
      transports: data.passkey.transports
    }],
    userVerification: 'required'
  }
  const options = await generateAuthenticationOptions(registrationOptions)
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

export async function VerifyPasskeyAuthentication(
  request: PayloadRequest,
  rpID: string,
  session_callback: (accountInfo: AccountInfo) => Promise<Response>,
): Promise<Response> {
  try {
    const parsedCookies = parseCookies(request.headers)

    const challenge = parsedCookies.get('__session-webpk-challenge')
    if (!challenge) {
      throw new MissingOrInvalidSession()
    }
    // @ts-expect-error TODO: Fix undefined object method
    const { data } = await request.json() as {
      data: {
        email: string,
        authentication: AuthenticationResponseJSON,
        passkey: {
          backedUp: boolean,
          counter: 0,
          credentialId: string,
          deviceType: string,
          publicKey: Record<string, number>,
          transports: AuthenticatorTransportFuture[]
        }
      }
    }

    const verification = await verifyAuthenticationResponse({
      response: data.authentication,
      expectedChallenge: challenge,
      expectedOrigin: request.payload.config.serverURL,
      expectedRPID: rpID,
      credential: {
        id: data.passkey.credentialId,
        publicKey: new Uint8Array(Object.values(data.passkey.publicKey)),
        counter: data.passkey.counter,
        transports: data.passkey.transports
      }
    });
    if (!verification.verified) {
      throw new PasskeyVerificationAPIError()
    }
    const {
      credentialID,
      credentialDeviceType,
      credentialBackedUp, newCounter, } = verification.authenticationInfo!;
    return await session_callback({
      sub: hashCode(data.email + request.payload.secret).toString(),
      name: '',
      picture: '',
      email: data.email,
      passKey: {
        credentialId: credentialID,
        counter: newCounter,
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp
      }
    })
  } catch (error) {
    console.error(error);
    return Response.json({})
  }
}