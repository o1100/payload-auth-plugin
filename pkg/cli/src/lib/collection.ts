import fs from "node:fs"
import path from "node:path"
function findFile(fileName: string, directory: string) {
  const files = fs.readdirSync(directory)
  console.log(files)

  for (const file of files) {
    const filePath = path.join(directory, file)
    const stat = fs.statSync(filePath)
    if (!stat.isFile() || file !== fileName) {
      return null
    }
    return filePath
  }
  return null
}

export async function getCollection(
  cwd: string,
  collectionDir: string,
  collectionName: string,
) {
  const collection = findFile(collectionName, cwd + "/" + collectionDir)
  console.log(collection)
}
