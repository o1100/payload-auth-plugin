'use client'

import React from 'react'
import { signin } from "payload-auth-plugin/client"
import { useRouter } from 'next/navigation'
import { Button, toast } from '@payloadcms/ui'
const AdminLoginViewClient = () => {
    const router = useRouter()

    const { oauth } = signin({ name: "admin" })

    const handleGoogleSignin = async () => {
        const { isError, isSuccess, message } = await oauth("google")
        if (isSuccess) {
            toast.error(message)
            router.push("/admin")
        }
        if (isError) {
            toast.error(message)
        }
    }
    return (
        <div className='w-full h-full bg-red-500'>
            <div className='flex flex-col items-start gap-y-4'>
                <Button type="button" onClick={handleGoogleSignin}>
                    Signin with Google
                </Button>
            </div>
        </div>
    )
}

export default AdminLoginViewClient