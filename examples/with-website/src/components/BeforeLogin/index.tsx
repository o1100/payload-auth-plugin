import React from 'react'
  import { adminClient } from 'payload-auth-plugin/client'
import { Button } from '@payloadcms/ui'

const BeforeLogin: React.FC = () => {

  const { signin } = adminClient()

  const onGoogleAppSignin = async () => {
    const { data, message, isSuccess, isError } = await signin().oauth('google')
    return {
      data,
      message,
      isSuccess,
      isError,
    }
  }
  return (
    <div>
      <p>
        <b>Welcome to your dashboard!</b>
        {' This is where site admins will log in to manage your website.'}
      </p>

      <div className=''>
<Button>GOOGL</Button>
      </div>
    </div>
  )
}

export default BeforeLogin
