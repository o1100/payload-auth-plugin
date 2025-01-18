import type { PayloadRequest } from 'payload'
import { InvalidPasskeyRequest } from '../errors/consoleErrors'
import { GeneratePasskeyAuthentication, GeneratePasskeyRegistration, InitPasskey, VerifyPasskeyAuthentication, VerifyPasskeyRegistration } from '../protocols/passkey'
import { AccountInfo } from '../../types'

export function PasskeyHandlers(
    request: PayloadRequest,
    resource: string,
    rpID: string,
    sessionCallBack: (accountInfo: AccountInfo) => Promise<Response>,
): Promise<Response> {
    switch (resource) {
        case 'init':
            return InitPasskey(request)
        case 'generate-registration-options':
            return GeneratePasskeyRegistration(request, rpID)
        case 'verify-registration':
            return VerifyPasskeyRegistration(request, rpID, sessionCallBack)
        case 'generate-authentication-options':
            return GeneratePasskeyAuthentication(request, rpID)
        case 'verify-authentication':
            return VerifyPasskeyAuthentication(request, rpID, sessionCallBack)
        default:
            throw new InvalidPasskeyRequest()
    }
}
