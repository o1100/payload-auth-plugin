import { highlighter } from "./highlighter.js"
import { logger } from "./logger.js"
import * as v from "valibot"

export function handleError(error: unknown) {
  logger.error(
    `Something went wrong. Please check the error below for more details.`,
  )
  logger.error(`If the problem persists, please open an issue on GitHub.`)
  logger.error("")
  if (typeof error === "string") {
    logger.error(error)
    logger.break()
    process.exit(1)
  }

  if (error instanceof v.ValiError) {
    logger.error("Validation failed:")
    for (const issue of error.issues) {
      logger.error(`${highlighter.info(issue)}`)
    }
    logger.break()
    process.exit(1)
  }

  if (error instanceof Error) {
    logger.error(error.message)
    logger.break()
    process.exit(1)
  }

  logger.break()
  process.exit(1)
}
