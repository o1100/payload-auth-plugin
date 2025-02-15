import { Command } from "commander"
import { logger } from "../utils/logger.js"
import { handleError } from "../utils/error.js"
import { spinner } from "../utils/spinner.js"

export const initCommand = new Command()
  .name("init")
  .description("Install and set up payload-auth-plugin.")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd(),
  )
  .action(async (options) => {
    try {
      const loading = spinner("Wait").start()
      setTimeout(() => {
        loading.succeed("Done!")
      }, 2000)
      console.log(options)
      logger.break()
    } catch (error) {
      logger.break()
      handleError(error)
    }
  })
