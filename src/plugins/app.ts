/**
 * The App plugin is used for authenticating users in the frontent app of the Payload CMS application.
 * It support magic link, credentials, OAuth, and Passkey based authentications.
 *
 * On top of it, to add additional security it also support 2FA using OTP, and TOTP.
 *
 * The set up is very lean and flexible to tailor the auth process in a specific way.
 *
 * ```ts
 * import {appAuthPlugin} from "payload-auth-plugin";
 *
 * // TODO: Need complete implementation
 *
 * ```
 * @packageDocumentation
 */

import { Config, Plugin } from "payload"
import { OAuthProviderConfig, PasskeyProviderConfig } from "../types.js"
import { InvalidServerURL } from "../core/errors/consoleErrors.js"

interface UsersCollection {
  /**
   * Collection name
   *
   * @type {string}
   */
  name: string
  /**
   * Collection slug but optional
   *
   * @type {?string}
   */
  slug?: string | undefined
  /**
   * Hide the collection but optional. Not hidden by default
   *
   * @type {?(boolean | undefined)}
   */
  hidden?: boolean | undefined
}

interface AccountsCollection {
  /**
   * Collection name
   *
   * @type {string}
   */
  name: string
  /**
   * Collection slug but optional
   *
   * @type {?string}
   */
  slug?: string | undefined
  /**
   * Hide the collection but optional. Not hidden by default
   *
   * @type {?(boolean | undefined)}
   */
  hidden?: boolean | undefined
}

interface SessionsCollection {
  /**
   * Collection name
   *
   * @type {string}
   */
  name: string
  /**
   * Collection slug but optional
   *
   * @type {?string}
   */
  slug?: string | undefined
  /**
   * Hide the collection but optional. Hidden by default
   *
   * @default true
   *
   * @type {?(boolean | undefined)}
   */
  hidden?: boolean | undefined
}

/**
 * The App plugin to set up authentication to the intengrated frontend of Payload CMS.
 *
 * Add the plugin to your Payload project plugins.
 *
 */
interface PluginOptions {
  /**
   * Enable or disable plugin
   *
   * @default true
   *
   * @type {boolean}
   *
   */
  enabled?: boolean | undefined
  /**
   * Auth providers supported by the plugin
   *
   * @type {(OAuthProviderConfig | PasskeyProviderConfig)[]}
   */
  providers: (OAuthProviderConfig | PasskeyProviderConfig)[]
  /**
   * App users collection. This collection will be used to store all the app users.
   *
   * **Note:** It is recommended that this collection must be named differently than the Payload Admin users collection,
   * or else it can cause conflicts.
   *
   * @type {UsersCollection}
   */
  users: UsersCollection
  /**
   * User accounts collection. This collection will be used to store all the accounts that belongs to a user.
   * One user can have more than one account
   *
   * **NOTE:** If there is an accounts collection already existing, it is recommended that use a different name and slug(if using) to avoid conflicts.
   *
   * @type {AccountsCollection}
   */
  accounts: AccountsCollection

  sessions: SessionsCollection
}

/**
 * App plugin funtion.
 *
 * @param {PluginOptions} pluginOptions
 * @returns {Plugin}
 */
export const appAuthPlugin =
  (pluginOptions: PluginOptions): Plugin =>
  /**
   * Callback function to return the updated Payload config.
   *
   * @param {Config} incomingConfig
   * @returns {Config}
   */
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }

    if (pluginOptions.enabled === false) {
      return config
    }

    if (!config.serverURL) {
      throw new InvalidServerURL()
    }

    const { users, accounts, providers } = pluginOptions

    return config
  }
