'use client'
import React from 'react'
import { Button } from '@payloadcms/ui'
import './styles.scss'
import { adminAuthClient } from '@/lib/auth'

export const AdminLogin = () => {
  const { oauth } = adminAuthClient.signin()

  const handleGoogleSignin = async () => {
    oauth('google')
  }
  const handleAuth0Signin = async () => {
    oauth('auth0')
  }
  return (
    <div className="oauth-container">
      <Button type="button" onClick={handleGoogleSignin} className="oauth-btn">
        Signin with Google
      </Button>
      <Button type="button" onClick={handleAuth0Signin} className="oauth-btn">
        Signin with Auth0
      </Button>
    </div>
  )
}
