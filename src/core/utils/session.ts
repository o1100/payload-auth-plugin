import { SuccessKind } from "../../types.js"

export function sessionResponse(
  cookies: string[],
  returnURL?: string | undefined,
) {
  let res: Response = new Response()

  res = new Response(
    JSON.stringify({
      message: "Authentication successful",
      kind: SuccessKind.Created,
      isSuccess: true,
      isError: false,
    }),
    {
      status: 200,
    },
  )

  if (returnURL) {
    let channelID = new URL(returnURL).hash
    if (channelID) {
      res = new Response(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authentication Complete</title>
          </head>
          <body>
            <script type="text/javascript">
              const message = {
                message: "Authentication successful",
                kind: "Created",
                isSuccess: true,
                isError: false,
                timestamp: Date.now(),
              }
              const channel = new BroadcastChannel('${channelID.replace("#", "")}');
              channel.postMessage(message);
              channel.close();
              window.close()
            </script>
          </body>
        </html>
      `,
        {
          status: 200,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        },
      )
    }
  }
  cookies.forEach((cookie) => {
    res.headers.append("Set-Cookie", cookie)
  })
  return res
}

export const revokeSession = (cookies: string[]) => {
  const res = new Response(
    JSON.stringify({
      message: "Session revoked",
      kind: SuccessKind.Deleted,
      isSuccess: true,
      isError: false,
    }),
    {
      status: 200,
    },
  )

  cookies.forEach((cookie) => {
    res.headers.append("Set-Cookie", cookie)
  })
  return res
}
