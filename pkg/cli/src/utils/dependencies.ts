import { execa } from "execa"
import { getPackageManager } from "./pkg-manager.js"
import { spinner } from "./spinner.js"

const DEPENDENCIES = ["payload-auth-plugin@latest"]

export async function intallDeps(cwd: string, silent?: boolean | undefined) {
  const packageManager = await getPackageManager(cwd)

  const dependenciesSpinner = spinner(`Installing required dependencies.`, {
    silent,
  })?.start()

  dependenciesSpinner?.succeed()
  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...DEPENDENCIES],
    {
      cwd,
    },
  )
}
