import type { PayloadRequest } from 'payload'
import { InvalidPasskeyRequest } from '../errors/consoleErrors'
import { GeneratePasskeyRegistration } from '../protocols/passkey'

export function PasskeyHandlers(
    request: PayloadRequest,
    resource: string,
    rpID: string,
): Promise<Response> {
    switch (resource) {
        case 'generate-registration-options':
            return GeneratePasskeyRegistration(request, rpID)
        default:
            throw new InvalidPasskeyRequest()
    }
}
