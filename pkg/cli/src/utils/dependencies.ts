import { execa } from "execa"
import { getPackageManager } from "./pkg-manager.js"
import { spinner } from "./spinner.js"

const DEPENDENCIES = ["payload-auth-plugin@latest"]

export async function installDeps(cwd: string, silent?: boolean | undefined) {
  const packageManager = await getPackageManager(cwd)

  const dependenciesSpinner = spinner(`Installing required dependencies.`, {
    silent,
  })?.start()

  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...DEPENDENCIES],
    {
      cwd,
    },
  )
  dependenciesSpinner?.succeed()
}
