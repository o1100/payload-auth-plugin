import path from "path"
import fs from "fs-extra"
import { accountsCollection } from "./collections/accounts.js"
import consola from "consola"

export async function addAccountsCollection(
  cwd: string,
  collectionsDir: string,
  silent?: boolean | undefined,
) {
  const accountsCollectionSlug = await consola.prompt(
    "What should be the slug for the accounts collection?",
    {
      placeholder: "Not sure",
      initial: "accounts",
    },
  )

  consola.start("Checking for collections...", { silent })

  if (fs.existsSync(path.resolve(cwd, collectionsDir, "Accounts/index.ts"))) {
    consola.warn("Looks like Accounts collection already exists.", { silent })

    const overwriteAccountsCollection = await consola.prompt(
      "Do you want to ovewrite the existing Accounts collection?",
      {
        type: "confirm",
      },
    )

    if (overwriteAccountsCollection) {
      fs.removeSync(path.resolve(cwd, collectionsDir, "Accounts/index.ts"))
    } else {
      consola.error("Failed to create Accounts collection.", { silent })

      process.exit(1)
    }
  }

  await fs.createFile(path.resolve(cwd, collectionsDir, "Accounts/index.ts"))

  await fs.writeFile(
    path.resolve(cwd, collectionsDir, "Accounts/index.ts"),
    accountsCollection(accountsCollectionSlug),
  )
  consola.success("Successfully created Accounts collection", { silent })
}
