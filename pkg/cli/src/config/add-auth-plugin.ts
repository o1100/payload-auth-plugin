import fs from "fs-extra"
import { AUTH_PLUGIN_FILE, AUTH_PROVIDERS } from "../utils/consts.js"
import path from "path"
import { providersConfig } from "./auth-provider-config.js"
import kleur from "kleur"
import consola from "consola"

export async function addAuthPlugin(cwd: string, pluginType: string) {
  const pluginsDir = await consola.prompt(
    "Where is the Payload plugins directory located?",
    {
      initial: "src/plugins",
    },
  )

  const pluginsFile = path.resolve(cwd, pluginsDir, AUTH_PLUGIN_FILE)
  if (fs.existsSync(pluginsFile)) {
    consola.warn(`Looks like the ${AUTH_PLUGIN_FILE} already exists.`)
    const overwritePluginsFile = await consola.prompt(
      `Do you want to overwrite the existing ${AUTH_PLUGIN_FILE} file?`,
      {
        type: "confirm",
      },
    )
    if (overwritePluginsFile) {
      fs.removeSync(pluginsFile)
    } else {
      consola.error("Failed to create the plugins file!!!")
      process.exit(1)
    }
  }

  await fs.createFile(pluginsFile)

  const selectedAuthProviders = await consola.prompt(
    "Please select the auth providers you would like to add to you Payload project",
    {
      type: "multiselect",
      options: AUTH_PROVIDERS,
    },
  )

  await fs.writeFile(
    pluginsFile,
    addPlugin(
      pluginType,
      selectedAuthProviders.map((ap) => ap.value),
    ),
  )
  consola.success(
    `Successfully created ${kleur.bold(pluginsDir + "/" + AUTH_PLUGIN_FILE)}, and added the plugin along with the selected providers.`,
  )
  consola.info(
    `You can now import the ${kleur.bold("payloadAuthPlugins")} array in your Payload config file.`,
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
