import { AuthClient } from 'payload-auth-plugin/client'

export const appAuthClient = new AuthClient('app')
export const adminAuthClient = new AuthClient('admin')
