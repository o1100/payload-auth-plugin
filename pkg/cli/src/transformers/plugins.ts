import { SyntaxKind } from "ts-morph"
import { Transformer } from "./index.js"

export const transformPlugins: Transformer = async ({ sourceFile }) => {
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
      // Extract 'plugins'
      const pluginsProperty = configObject.getProperty("plugins")
      if (pluginsProperty?.isKind(SyntaxKind.PropertyAssignment)) {
        const pluginsArray = pluginsProperty.getInitializerIfKind(
          SyntaxKind.ArrayLiteralExpression,
        )
        if (pluginsArray) {
          console.log(
            "Plugins:",
            pluginsArray.getElements().map((el) => el.getText()),
          )
        }
      }
    }
  } else {
    console.log("buildConfig not found")
  }
  return sourceFile
}
