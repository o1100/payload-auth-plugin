import { BasePayload, getCookieExpiration } from 'payload'
import { UserNotFound } from '../errors/consoleErrors'
import jwt from 'jsonwebtoken'
import { AccountInfo } from '../../types'

type Collections = {
  accountsCollectionSlug: string
}

export class PayloadSession {
  readonly #collections: Collections
  readonly #successPath: string | undefined
  constructor(collections: Collections, successPath?: string) {
    this.#collections = collections
    this.#successPath = successPath
  }
  async #upsertAccount(
    accountInfo: AccountInfo,
    scope: string,
    issuerName: string,
    payload: BasePayload,
  ) {
    let userID: string = ''

    const user = await payload.find({
      collection: payload.config.admin.user,
      where: {
        email: {
          equals: accountInfo.email,
        },
      },
    })

    if (user.docs.length === 0) {
      throw new UserNotFound()
    }
    userID = user.docs[0].id as string

    const accounts = await payload.find({
      collection: this.#collections.accountsCollectionSlug,
      where: {
        sub: { equals: accountInfo.sub },
      },
    })
    const data: Record<string, unknown> = {
      scope,
      name: accountInfo.name,
      picture: accountInfo.picture,
    }

    // // Add passkey payload for auth
    if (issuerName === 'Passkey' && accountInfo.passKey) {

      data['passkey'] = {
        ...accountInfo.passKey
      }
    }

    if (accounts.docs.length > 0) {
      await payload.update({
        collection: this.#collections.accountsCollectionSlug,
        where: {
          id: {
            equals: accounts.docs[0].id,
          },
        },
        data,
      })
    } else {
      data['sub'] = accountInfo.sub
      data['issuerName'] = issuerName
      data['user'] = userID
      await payload.create({
        collection: this.#collections.accountsCollectionSlug,
        data,
      })
    }
    return userID
  }
  async createSession(
    accountInfo: AccountInfo,
    scope: string,
    issuerName: string,
    payload: BasePayload,
  ) {
    const userID = await this.#upsertAccount(accountInfo, scope, issuerName, payload)

    const fieldsToSign = {
      id: userID,
      email: accountInfo.email,
      collection: payload.config.admin.user,
    }

    const cookieExpiration = getCookieExpiration({
      seconds: 7200,
    })

    const token = jwt.sign(fieldsToSign, payload.secret, {
      expiresIn: new Date(cookieExpiration).getTime(),
    })

    const cookies: string[] = []
    cookies.push(
      `${payload.config.cookiePrefix!}-token=${token};Path=/;HttpOnly;SameSite=lax;Expires=${cookieExpiration.toString()}`,
    )
    const expired = 'Thu, 01 Jan 1970 00:00:00 GMT'
    cookies.push(`__session-oauth-state=; Path=/; HttpOnly; SameSite=Lax; Expires=${expired}`)
    cookies.push(`__session-oauth-nonce=; Path=/; HttpOnly; SameSite=Lax; Expires=${expired}`)
    cookies.push(`__session-code-verifier=; Path=/; HttpOnly; SameSite=Lax; Expires=${expired}`)
    cookies.push(`__session-webpk-challenge=; Path=/; HttpOnly; SameSite=Lax; Expires=${expired}`)

    let redirectURL = payload.getAdminURL()
    if (this.#successPath) {
      const newURL = new URL(payload.getAdminURL())
      newURL.pathname = this.#successPath
      redirectURL = newURL.toString()
    }
    const res = new Response(null, {
      status: 302,
      headers: {
        Location: redirectURL,
      },
    })

    cookies.forEach(cookie => {
      res.headers.append('Set-Cookie', cookie)
    })
    return res
  }
}
