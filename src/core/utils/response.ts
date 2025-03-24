export const oauthClientUserNotFound = (returnURL: string) => {
  let channelID = new URL(returnURL).hash
  return new Response(
    `
        <!DOCTYPE html>
        <html>
          <head>
            <title>User not found</title>
          </head>
          <body>
            <script type="text/javascript">
              const message = {
                message: "User not found",
                kind: "NotFound",
                isSuccess: false,
                isError: true,
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
