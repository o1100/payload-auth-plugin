import path from "path"
import fs from "fs-extra"
import { accountsCollection } from "./collections/accounts.js"
import consola from "consola"

export async function addAccountsCollection(cwd: string) {
  const collectionsDir = await consola.prompt(
    "Where is the Payload collections directory located?",
    {
      initial: "src/collections",
    },
  )

  const accountsCollectionSlug = await consola.prompt(
    "What should be the slug for the accounts collection?",
    {
      placeholder: "Not sure",
      initial: "accounts",
    },
  )

  consola.start("Checking for collections...")

  if (fs.existsSync(path.resolve(cwd, collectionsDir, "Accounts/index.ts"))) {
    consola.warn("Looks like Accounts collection already exists.")

    const overwriteAccountsCollection = await consola.prompt(
      "Do you want to ovewrite the existing Accounts collection?",
      {
        type: "confirm",
      },
    )

    if (overwriteAccountsCollection) {
      fs.removeSync(path.resolve(cwd, collectionsDir, "Accounts/index.ts"))
    } else {
      consola.error("Failed to create Accounts collection.")

      process.exit(1)
    }
  }

  await fs.createFile(path.resolve(cwd, collectionsDir, "Accounts/index.ts"))

  await fs.writeFile(
    path.resolve(cwd, collectionsDir, "Accounts/index.ts"),
    accountsCollection(accountsCollectionSlug),
  )
  consola.success("Successfully created Accounts collection")
}
