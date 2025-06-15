import { useEffect, useState } from 'react'
import { getClientSession } from 'payload-auth-plugin/client'

export const useSession = () => {
  const [loading, setLoading] = useState<boolean>()
  const [session, setSession] = useState({
    data: {},
    message: '',
    isSuccess: false,
  })

  useEffect(() => {
    setLoading(true)
    const fetchSession = async () => {
      const { data, isSuccess, message } = await getClientSession({ name: 'app' })
      if (!isSuccess) {
        setSession({
          data: {},
          message,
          isSuccess,
        })
      }
      setSession({
        data,
        message,
        isSuccess,
      })
      setLoading(false)
    }
    fetchSession()
  }, [])

  return {
    loading,
    ...session,
  }
}
