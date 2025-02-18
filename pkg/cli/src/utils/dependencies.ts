import { execa } from "execa"
import { getPackageManager } from "./pkg-manager.js"
import { spinner } from "./spinner.js"
import consola from "consola"

const DEPENDENCIES = ["payload-auth-plugin@latest"]

export async function installDeps(cwd: string, silent?: boolean | undefined) {
  const packageManager = await getPackageManager(cwd)

  consola.start(`Installing required dependencies.`, {
    silent,
  })

  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...DEPENDENCIES],
    {
      cwd,
    },
  )
  consola.success("Successfully installed all required dependencies.")
}
