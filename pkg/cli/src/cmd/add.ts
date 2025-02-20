import { Command } from "commander"
import * as logger from "@clack/prompts"
import * as v from "valibot"

const addOptionsSchema = v.object({
  cwd: v.string(),
})

export const addCommand = new Command()
  .name("add")
  .description("Add 3rd party authentication providers")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd(),
  )
  .action(async (incomingOptions) => {
    try {
      const options = v.parse(addOptionsSchema, incomingOptions)
    } catch (error) {
      console.log(error)
      logger.log.error("Something is not right. Try again")
    }
  })
