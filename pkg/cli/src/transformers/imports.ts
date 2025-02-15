import { ImportSpecifier } from "ts-morph"
import { Transformer } from "./index.js"

export const transformImport: Transformer = async ({ sourceFile }) => {
  const importDeclarations = sourceFile.getImportDeclarations()

  for (const importDeclaration of importDeclarations) {
    const namedImports = importDeclaration.getNamedImports()

    // const findfb = namedImports.(
    //   (namedImport) => namedImport.getName() === "FacebookAuthProvider",
    // )

    // if (!findfb) {
    //   console.log("dsadsdsadas")
    // }

    // const
    // for (const module of ) {
    //   console.log(module)

    //   if (module === "../../../payload-auth-plugin/dist/esm") {
    //     console.log("FOUND")
    //   }
    // }
  }

  return sourceFile
}
