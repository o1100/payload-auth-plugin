import fs from "fs-extra"
import { Command } from "commander"
import { logger } from "../utils/logger.js"
import { handleError } from "../utils/error.js"
import prompts from "prompts"
import * as v from "valibot"
import { intallDeps } from "../utils/dependencies.js"
import path from "path"
import { accountsCollection } from "../config/collections/accounts.js"

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
      logger.info("")

      const options = v.parse(initOptionsSchema, incomingOptions)

      // Prompt for plugin
      const { pluginType } = await prompts({
        type: "select",
        name: "pluginType",
        message: "Which plugin you want to set up?",
        choices: [
          {
            title: "App authentication plugin",
            description:
              "This plugin is used for implementing authentication only to the frontend of Payload project.",
            value: "app",
          },
          {
            title: "Admin authentication plugin",
            description:
              "This plugin is used for implementing authentication only to the Admin of Payload project.",
            value: "admin",
          },
        ],
      })

      if (pluginType === "app") {
        await setupApp(options)
      } else if (pluginType === "admin") {
        await setupAdmin(options)
      } else {
        logger.break()
        logger.error("Wrong plugin type")
        process.exit(1)
      }

      logger.break()
    } catch (error) {
      logger.break()
      handleError(error)
    }
  })

async function setupApp(options: v.InferInput<typeof initOptionsSchema>) {
  // Prompt for Payload plugin file path
  const { pluginsFilePath } = await prompts({
    type: "text",
    name: "pluginsFilePath",
    message: "Path to the Payload plugins files:",
    initial: "src/plugins/index.ts",
  })

  // Prompt for Payload plugin file path
  const { collectionsDir } = await prompts({
    type: "text",
    name: "collectionsDir",
    message: "Path to the Payload collections directory:",
    initial: "src/collections",
  })

  // Prompt for Payload plugin file path
  const { accountsCollectionSlug } = await prompts({
    type: "text",
    name: "accountsCollectionSlug",
    message: "What should be the slug for the accounts collection:",
    initial: "accounts",
  })

  // Installing dependencies
  //   await intallDeps(options.cwd, options.silent)

  if (fs.existsSync(path.resolve(options.cwd, collectionsDir, ""))) {
    logger.break()
    logger.error("The Auth collection directory already exists.")
    process.exit(1)
  }
  fs.mkdir(path.resolve(options.cwd, collectionsDir, "Auth"))
  logger.info("")
}

async function setupAdmin(options: v.InferInput<typeof initOptionsSchema>) {
  // Prompt for Payload plugin file path
  const { pluginsFilePath } = await prompts({
    type: "text",
    name: "pluginsFilePath",
    message: "Path to the Payload plugins files:",
    initial: "src/plugins/index.ts",
  })

  // Prompt for Payload plugin file path
  const { collectionsDir } = await prompts({
    type: "text",
    name: "collectionsDir",
    message: "Path to the Payload collections directory:",
    initial: "src/collections",
  })

  // Prompt for Payload plugin file path
  const { accountsCollectionSlug } = await prompts({
    type: "text",
    name: "accountsCollectionSlug",
    message: "What should be the slug for the accounts collection:",
    initial: "accounts",
  })

  if (
    fs.existsSync(
      path.resolve(options.cwd, collectionsDir, "Accounts/index.ts"),
    )
  ) {
    logger.break()
    logger.warn("Looks like Accounts collection already exists.")
    const { overwriteAccountsCollection } = await prompts({
      type: "confirm",
      name: "overwriteAccountsCollection",
      message: "Do you want to overwrite the existing Accounts collection?",
    })
    if (overwriteAccountsCollection) {
      fs.removeSync(
        path.resolve(options.cwd, collectionsDir, "Accounts/index.ts"),
      )
    } else {
      process.exit(1)
    }
  }
  await fs.createFile(
    path.resolve(options.cwd, collectionsDir, "Accounts/index.ts"),
  )
  await fs.writeFile(
    path.resolve(options.cwd, collectionsDir, "Accounts/index.ts"),
    accountsCollection(accountsCollectionSlug),
  )
  logger.info("")
}
