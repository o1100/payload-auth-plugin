import fs from "fs-extra"
import { AUTH_PLUGIN_FILE, AUTH_PROVIDERS } from "../utils/consts.js"
import { logger } from "../utils/logger.js"
import prompts from "prompts"
import path from "path"
import { providersConfig } from "./auth-provider-config.js"
import kleur from "kleur"

export async function addAuthPlugin(
  cwd: string,
  pluginType: string,
  silent?: boolean | undefined,
) {
  const { pluginsDir } = await prompts({
    type: "text",
    name: "pluginsDir",
    message: "Where is the Payload plugins directory located?:",
    initial: "src/plugins",
  })

  const pluginsFile = path.resolve(cwd, pluginsDir, AUTH_PLUGIN_FILE)
  if (fs.existsSync(pluginsFile)) {
    logger.break()
    logger.warn(`Looks like the ${AUTH_PLUGIN_FILE} already exists.`)
    const { overwriteAccountsCollection } = await prompts({
      type: "confirm",
      name: "overwriteAccountsCollection",
      message: `Do you want to overwrite the existing ${AUTH_PLUGIN_FILE} file?`,
    })
    if (overwriteAccountsCollection) {
      fs.removeSync(pluginsFile)
    } else {
      process.exit(1)
    }
  }

  await fs.createFile(pluginsFile)

  const { selectedAuthProviders } = await prompts({
    type: "multiselect",
    name: "selectedAuthProviders",
    message:
      "Please select the auth providers you would like to add to you Payload project:",
    choices: AUTH_PROVIDERS,
  })

  await fs.writeFile(pluginsFile, addPlugin(pluginType, selectedAuthProviders))
  logger.info("")
  logger.success(
    `✅ Successfully created ${kleur.bold(pluginsDir + "/" + AUTH_PLUGIN_FILE)}, and added the plugin along with the selected providers.`,
  )
}

const addPlugin = (pluginType: string, providers: string[]) =>
  `import {${pluginType}} from "payload-auth-plugin";
import {${providers.join(", ")}} from "payload-auth-plugin/providers";

export const payloadAuthPlugins=[
  adminAuthPlugin({
    providers: [
      ${providers.map((provider) => providersConfig[provider])}
    ]
  })
]
`
