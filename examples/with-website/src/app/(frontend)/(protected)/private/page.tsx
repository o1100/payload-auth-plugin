import { cookies } from 'next/headers'
import React from 'react'

const Page = async () => {
    const cookieStore = await cookies()
    // cookieStore.get("")
    return (
        <div>This is a private page</div>
    )
}

export default Page