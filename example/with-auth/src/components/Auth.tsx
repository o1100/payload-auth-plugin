import { signin } from '../../../../dist/client'
export const AuthComponent = () => {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <form
        action={async () => {
          'use server'
          signin('auth0')
        }}
        method="POST"
        className="w-full"
      >
        <button type="submit">Sign in with Auth0</button>
      </form>
      <form
        action={async () => {
          'use server'
          signin('cognito')
        }}
        method="POST"
        className="w-full"
      >
        <button type="submit">Sign in with Cognito</button>
      </form>
    </div>
  )
}
