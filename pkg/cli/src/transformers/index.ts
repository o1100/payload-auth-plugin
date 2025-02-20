import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"

import { Project, ScriptKind, type SourceFile } from "ts-morph"
import { transformImport } from "./imports.js"
import { transformCollections } from "./collections.js"

export type TransformOpts = {
  filename: string
  raw: string
  isRemote?: boolean
  collectionExportName?: string
}

export type Transformer<Output = SourceFile> = (
  opts: TransformOpts & {
    sourceFile: SourceFile
  },
) => Promise<Output>

const project = new Project({
  compilerOptions: {},
})

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "payloadAuth-"))
  return path.join(dir, filename)
}

export async function transform(
  opts: TransformOpts,
  transformers: Transformer[] = [transformImport, transformCollections],
) {
  const tempFile = await createTempSourceFile(opts.filename)
  const sourceFile = project.createSourceFile(tempFile, opts.raw, {
    scriptKind: ScriptKind.TS,
  })

  for (const transformer of transformers) {
    await transformer({ sourceFile, ...opts })
  }

  if (opts.collectionExportName) {
    return await transformCollections({ sourceFile, ...opts })
  }

  return sourceFile.getText()
}
