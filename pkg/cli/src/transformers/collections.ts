import { SourceFile, SyntaxKind } from "ts-morph"
import { Transformer } from "./index.js"

export const transformCollections: Transformer = async ({
  sourceFile,
  collectionExportName,
}) => {
  const buildConfigCall = sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .find((call) => {
      return call.getExpression().getText() === "buildConfig"
    })

  if (buildConfigCall) {
    const configObject = buildConfigCall.getArguments()[0]

    if (
      configObject &&
      configObject.isKind(SyntaxKind.ObjectLiteralExpression)
    ) {
      // Extract 'collections'
      const collectionsProperty = configObject.getProperty("collections")
      if (collectionsProperty?.isKind(SyntaxKind.PropertyAssignment)) {
        const collectionsArray = collectionsProperty.getInitializerIfKind(
          SyntaxKind.ArrayLiteralExpression,
        )
        if (collectionsArray) {
          console.log(
            "Collections:",
            collectionsArray.getElements().map((el) => el.getText()),
          )
          collectionExportName &&
            collectionsArray.addElement(collectionExportName)
        }
      }
    }
  } else {
    console.log("buildConfig not found")
  }
  return sourceFile
}
