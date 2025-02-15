import { Command } from "commander"
import { logger } from "../utils/logger.js"
import { handleError } from "../utils/error.js"
import prompts from "prompts"
import * as v from "valibot"
import { intallDeps } from "../utils/dependencies.js"

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

      await setup(options)

      logger.break()
    } catch (error) {
      logger.break()
      handleError(error)
    }
  })

async function setup(options: v.InferInput<typeof initOptionsSchema>) {
  // Prompt for Payload plugin file path
  const { pluginsFilePath } = await prompts({
    type: "text",
    name: "pluginsFilePath",
    message: "Path to the Payload plugins files.",
    initial: "src/plugins/index.ts",
  })

  // Prompt for Payload plugin file path
  const { collectionsDir } = await prompts({
    type: "text",
    name: "collectionsDir",
    message: "Path to the Payload collections directory.",
    initial: "src/collections",
  })

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

  // Installing dependencies
  await intallDeps(options.cwd, options.silent)

  logger.info("")
}
