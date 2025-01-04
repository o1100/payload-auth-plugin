import { APIError } from "payload";

class AuthAPIError extends APIError {
    constructor(message: string, status?: number, data?: Record<string, unknown> | undefined) {
        super(message, status ?? 400, data, true)
    }
}

export class MissingEmailAPIError extends AuthAPIError {
    constructor() {
        super("Missing email. Email is required")
    }
}