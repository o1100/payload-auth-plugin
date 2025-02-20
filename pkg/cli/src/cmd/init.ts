import { Command } from "commander"
import { handleError } from "../utils/error.js"
import * as v from "valibot"
import { installDeps } from "../utils/dependencies.js"
import { addAuthPlugin } from "../config/add-auth-plugin.js"
import { addAccountsCollection } from "../config/add-accounts-collection.js"
import consola from "consola"

const initOptionsSchema = v.object({
  cwd: v.string(),
  silent: v.boolean(),
})

export const initCommand = new Command()
  .name("init")
  .description("Install and set up payload-auth-plugin.")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd(),
  )
  .option("-s, --silent", "mute output.", false)
  .action(async (incomingOptions) => {
    try {
      const options = v.parse(initOptionsSchema, incomingOptions)

      // Installing dependencies
      await installDeps(options.cwd)

      // Prompt for plugin
      const pluginType = await consola.prompt(
        "Which plugin you want to set up?",
        {
          type: "select",
          options: [
            {
              label: "Admin authentication plugin",
              hint: "This plugin is used for implementing authentication only to the Admin of Payload project.",
              value: "admin",
            },
            {
              label: "App authentication plugin",
              hint: "This plugin is used for implementing authentication only to the frontend of Payload project.",
              value: "app",
            },
          ],
        },
      )

      if (pluginType === "app") {
        await setupApp(options)
      } else if (pluginType === "admin") {
        await setupAdmin(options)
      } else {
        consola.error("Wrong plugin type")
        process.exit(1)
      }
    } catch (error) {
      handleError(error)
    }
  })

async function setupApp(options: v.InferInput<typeof initOptionsSchema>) {
  // // Prompt for Payload plugin file path
  // const { pluginsFilePath } = await prompts({
  //   type: "text",
  //   name: "pluginsFilePath",
  //   message: "Path to the Payload plugins files:",
  //   initial: "src/plugins/index.ts",
  // })
  // // Prompt for Payload plugin file path
  // const { collectionsDir } = await prompts({
  //   type: "text",
  //   name: "collectionsDir",
  //   message: "Path to the Payload collections directory:",
  //   initial: "src/collections",
  // })
  // // Prompt for Payload plugin file path
  // const { accountsCollectionSlug } = await prompts({
  //   type: "text",
  //   name: "accountsCollectionSlug",
  //   message: "What should be the slug for the accounts collection:",
  //   initial: "accounts",
  // })
  // // Installing dependencies
  // //   await intallDeps(options.cwd, options.silent)
  // if (fs.existsSync(path.resolve(options.cwd, collectionsDir, ""))) {
  //   logger.break()
  //   logger.error("The Auth collection directory already exists.")
  //   process.exit(1)
  // }
  // fs.mkdir(path.resolve(options.cwd, collectionsDir, "Auth"))
  // logger.info("")
}

async function setupAdmin(options: v.InferInput<typeof initOptionsSchema>) {
  // Collections

  // Accounts collection
  await addAccountsCollection(options.cwd)

  // Payload plugin file
  await addAuthPlugin(options.cwd, "adminAuthPlugin")
}
