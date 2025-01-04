import { PayloadRequest } from 'payload'
import {
  generateRegistrationOptions,
  GenerateRegistrationOptionsOpts,
} from '@simplewebauthn/server'
import { MissingEmailAPIError } from '../errors/apiErrors'

export async function GeneratePasskeyRegistration(
  request: PayloadRequest,
  rpID: string,
): Promise<Response> {
  // @ts-expect-error TODO: Fix undefined object method
  const { data } = await request.json() as { data: { email: string } }

  if (!data.email) {
    throw new MissingEmailAPIError()
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
  return Response.json({ options })
}
