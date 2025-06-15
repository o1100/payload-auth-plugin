'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import { getClientSession } from 'payload-auth-plugin/client'
import { useSession } from '@/hooks/session'

const PageClient: React.FC = () => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()
  const { data, loading } = useSession()
  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])
  return (
    <React.Fragment>
      {loading && <div>Loading....</div>}
      {data && <div>{JSON.stringify(data)}</div>}
    </React.Fragment>
  )
}

export default PageClient
