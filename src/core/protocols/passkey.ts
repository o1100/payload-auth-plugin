import { PayloadRequest } from "payload";
import { generateRegistrationOptions, GenerateRegistrationOptionsOpts } from '@simplewebauthn/server'

const user = {
    id: '123df23124321',
    username: 'sourab',
    credentials: [{
        id: '',
        transports: []
    }]
}

export async function GeneratePasskeyRegistration(request: PayloadRequest, rpID: string): Promise<Response> {
    const registrationOptions: GenerateRegistrationOptionsOpts = {
        rpName: 'Payload WebAuthn',
        rpID,
        userName: 'sourab',
        timeout: 60000,
        attestationType: 'none',
        excludeCredentials: user.credentials.map((cred) => ({
            id: cred.id,
            type: 'public-key',
            transports: cred.transports,
        })),
        authenticatorSelection: {
            residentKey: 'discouraged',
            userVerification: 'preferred',
        },
        supportedAlgorithmIDs: [-7, -257],
    }
    const options = await generateRegistrationOptions(registrationOptions);
    return Response.json({ options })
}