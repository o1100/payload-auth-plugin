import { appAuthClient } from '@/lib/auth'
import { useEffect, useState } from 'react'

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
      const { data, isSuccess, message } = await appAuthClient.getClientSession()
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
