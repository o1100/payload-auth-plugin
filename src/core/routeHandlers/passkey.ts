import type { PayloadRequest } from 'payload'
import { InvalidPasskeyRequest } from '../error'
import { GeneratePasskeyRegistration } from '../protocols/passkey'

export function PasskeyHandlers(
    request: PayloadRequest,
    resource: string,
    rpID: string
    //   sessionCallBack: (oauthAccountInfo: OAuthAccountInfo) => Promise<Response>,
): Promise<Response> {
    switch (resource) {
        case 'generate-registration-options':
            return GeneratePasskeyRegistration(request, rpID)

        default:
            throw new InvalidPasskeyRequest()
    }
}