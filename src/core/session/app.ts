import { BasePayload, JsonObject, TypeWithID } from "payload"
import { AccountInfo } from "../../types.js"
import { ErrorKind, PluginError } from "../../error.js"

export class AppSession {
  constructor(
    private collections: {
      usersCollection: string
      accountsCollection: string
      sessionsCollection: string
    },
    private onSuccess: ({
      user,
      account,
    }: {
      user?: (JsonObject & TypeWithID) | undefined
      account?: (JsonObject & TypeWithID) | undefined
    }) => void,
    private onError: (err: PluginError) => void,
    private allowAutoSignUp: boolean,
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
    payload: BasePayload,
  ) {
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
    } else if (this.allowAutoSignUp) {
      const userRecords = await payload.create({
        collection: this.collections.usersCollection,
        data: {
          email: oauthAccountInfo.email,
        },
      })
      userRecord = userRecords
    } else {
      return this.onError({
        message: "User not found",
        kind: ErrorKind.NotFound,
      })
    }

    const accountRecord = await this.oauthAccountMutations(
      userRecord["id"] as string,
      oauthAccountInfo,
      scope,
      issuerName,
      payload,
    )
    return this.onSuccess({ user: userRecord, account: accountRecord })
  }
}
