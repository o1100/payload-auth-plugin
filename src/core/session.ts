import {
  BasePayload,
  JsonObject,
  parseCookies,
  PayloadRequest,
  TypeWithID,
} from "payload"
import { AccountInfo } from "./../types.js"
import {
  createSessionCookies,
  invalidateOAuthCookies,
} from "./utils/cookies.js"
import { APP_COOKIE_SUFFIX } from "./../constants.js"
import { oauthClientUserNotFound } from "./utils/response.js"
import * as jose from "jose"
import { UserNotFoundAPIError } from "./errors/apiErrors.js"

export class AuthSession {
  constructor(
    private appName: string,
    private collections: {
      usersCollection: string
      accountsCollection: string
    },
    private allowOAuthAutoSignUp: boolean,
    private secret: string,
    private useAdmin: boolean,
  ) {}

  private async oauthAccountMutations(
    userId: string,
    oauthAccountInfo: AccountInfo,
    scope: string,
    issuerName: string,
    payload: BasePayload,
  ): Promise<JsonObject & TypeWithID> {
    const data: Record<string, unknown> = {
      scope,
      name: oauthAccountInfo.name,
      picture: oauthAccountInfo.picture,
      issuerName,
    }

    const accountRecords = await payload.find({
      collection: this.collections.accountsCollection,
      where: {
        sub: { equals: oauthAccountInfo.sub },
      },
    })

    if (accountRecords.docs && accountRecords.docs.length === 1) {
      return await payload.update({
        collection: this.collections.accountsCollection,
        id: accountRecords.docs[0].id,
        data,
      })
    } else {
      data["sub"] = oauthAccountInfo.sub
      data["user"] = userId
      return await payload.create({
        collection: this.collections.accountsCollection,
        data,
      })
    }
  }

  async oauthSessionCallback(
    oauthAccountInfo: AccountInfo,
    scope: string,
    issuerName: string,
    request: PayloadRequest,
  ) {
    const { payload } = request
    const userRecords = await payload.find({
      collection: this.collections.usersCollection,
      where: {
        email: {
          equals: oauthAccountInfo.email,
        },
      },
    })
    let userRecord: JsonObject & TypeWithID

    if (userRecords.docs.length === 1) {
      userRecord = userRecords.docs[0]
    } else if (this.allowOAuthAutoSignUp) {
      let data: Record<string, unknown> = {
        email: oauthAccountInfo.email,
      }
      const hasAuthEnabled = Boolean(
        payload.collections[this.collections.usersCollection].config.auth,
      )
      if (hasAuthEnabled) {
        data["password"] = jose.base64url.encode(
          crypto.getRandomValues(new Uint8Array(16)),
        )
      }

      const cookies = parseCookies(request.headers)
      if (cookies.has("oauth_profile")) {
        const profileData = JSON.parse(
          decodeURIComponent(cookies.get("oauth_profile")!),
        )
        data = {
          ...data,
          ...profileData,
        }
      }

      const userRecords = await payload.create({
        collection: this.collections.usersCollection,
        data,
      })
      userRecord = userRecords
    } else {
      return new UserNotFoundAPIError()
    }

    await this.oauthAccountMutations(
      userRecord["id"] as string,
      oauthAccountInfo,
      scope,
      issuerName,
      payload,
    )

    let cookies: string[] = []

    const cookieName = this.useAdmin
      ? `${payload.config.cookiePrefix!}-token`
      : `__${this.appName}-${APP_COOKIE_SUFFIX}`

    const secret = this.useAdmin ? payload.secret : this.secret

    cookies = [
      ...(await createSessionCookies(cookieName, secret, {
        id: userRecord["id"],
        email: oauthAccountInfo.email,
        collection: this.collections.usersCollection,
      })),
    ]

    cookies = invalidateOAuthCookies(cookies)

    return
  }

  async passwordSessionCallback(
    user: Pick<AccountInfo, "email"> & { id: string },
  ) {
    let cookies: string[] = []

    cookies = [
      ...(await createSessionCookies(
        `__${this.appName}-${APP_COOKIE_SUFFIX}`,
        this.secret,
        {
          id: user.id,
          email: user.email,
          collection: this.collections.usersCollection,
        },
      )),
    ]
    cookies = invalidateOAuthCookies(cookies)

    // return sessionResponse(cookies)
  }
}
