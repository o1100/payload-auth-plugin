import { MissingEnv } from "../errors/consoleErrors.js"

export function preflightEnvCheck(pluginType: "admin" | "app") {
  switch (pluginType) {
    case "app":
      if (process.env.APP_AUTH_SECRET) {
        throw new MissingEnv("APP_AUTH_SECRET")
      }
      break
    default:
      break
  }
}
