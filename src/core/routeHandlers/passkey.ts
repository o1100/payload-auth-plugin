import type { PayloadRequest } from 'payload'
import { InvalidPasskeyRequest } from '../errors/consoleErrors'
import { GeneratePasskeyRegistration, VerifyPasskeyRegistration } from '../protocols/passkey'
import { AccountInfo } from '../../types'

export function PasskeyHandlers(
    request: PayloadRequest,
    resource: string,
    rpID: string,
    sessionCallBack: (accountInfo: AccountInfo) => Promise<Response>,
): Promise<Response> {
    switch (resource) {
        case 'generate-registration-options':
            return GeneratePasskeyRegistration(request, rpID)
        case 'verify-registration':
            return VerifyPasskeyRegistration(request, rpID, sessionCallBack)
        default:
            throw new InvalidPasskeyRequest()
    }
}
