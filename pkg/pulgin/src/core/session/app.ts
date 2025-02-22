import { BasePayload } from "payload"
import { AccountInfo } from "../../types.js"

/**
 * Description placeholder
 *
 * @export
 * @class AppSession
 * @typedef {AppSession}
 * @internal
 */
export class AppSession {
  constructor(
    private name: string,
    private collections: {
      usersCollection: string
      accountsCollection: string
      sessionsCollection: string
    },
  ) {}

  private async oauthAccountMutations(
    userId: string,
    oauthAccountInfo: AccountInfo,
    scope: string,
    issuerName: string,
    payload: BasePayload,
  ) {
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
      await payload.update({
        collection: this.collections.accountsCollection,
        id: accountRecords.docs[0].id,
        data,
      })
    } else {
      data["sub"] = oauthAccountInfo.sub
      data["user"] = userId
      await payload.create({
        collection: this.collections.accountsCollection,
        data,
      })
    }
  }

  async oauthSessionCallback(
    oauthAccountInfo: AccountInfo,
    scope: string,
    issuerName: string,
    payload: BasePayload,
  ): Promise<Response> {
    const userRecords = await payload.find({
      collection: this.collections.usersCollection,
      where: {
        email: {
          equals: oauthAccountInfo.email,
        },
      },
    })

    if (userRecords.docs.length === 1) {
      const userRecord = userRecords.docs[0]
      await this.oauthAccountMutations(
        userRecord.id as string,
        oauthAccountInfo,
        scope,
        issuerName,
        payload,
      )
    }

    return Response.json({})
  }
}
