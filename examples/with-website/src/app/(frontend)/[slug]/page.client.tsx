'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import { useSession } from '@/hooks/session'
import { Button } from '@/components/ui/button'
import { signout } from 'payload-auth-plugin/client'

const PageClient: React.FC = () => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()
  const { isSuccess, loading } = useSession()

  const handleSignOut = async () => {
    await signout({ name: 'app', returnTo: '/auth/signin' })
  }

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  return (
    <React.Fragment>
      <div className="pt-10">
        {loading && <div>Loading....</div>}
        {isSuccess && <Button onClick={() => handleSignOut()}>Sign Out</Button>}
      </div>
    </React.Fragment>
  )
}

export default PageClient
