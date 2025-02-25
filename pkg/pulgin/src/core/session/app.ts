import { BasePayload } from "payload"
import { AccountInfo } from "../../types.js"
import { UserNotFound } from "../errors/consoleErrors.js"

/**
 * Description placeholder
 *
 * @export
 * @class AppSession
 * @typedef {AppSession}
 * @internal
 */
export class AppSession {
  private appName: string
  private collections: Record<string, string>
  constructor(
    name: string,
    collections: {
      usersCollection: string
      accountsCollection: string
      sessionsCollection: string
    },
  ) {
    this.collections = collections
    this.appName = name
  }

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
    allowAutoSignUp: boolean,
  ): Promise<Response> {
    const userRecords = await payload.find({
      collection: this.collections.usersCollection,
      where: {
        email: {
          equals: oauthAccountInfo.email,
        },
      },
    })
    let userRecordID: string
    if (userRecords.docs.length === 1) {
      userRecordID = userRecords.docs[0].id as string
    } else if (allowAutoSignUp) {
      const userRecords = await payload.create({
        collection: this.collections.usersCollection,
        data: {
          email: oauthAccountInfo.email,
        },
      })
      userRecordID = userRecords.id as string
    } else {
      throw new UserNotFound()
    }

    await this.oauthAccountMutations(
      userRecordID,
      oauthAccountInfo,
      scope,
      issuerName,
      payload,
    )
    return Response.json({})
  }
}
