import { useEffect, useState } from 'react'
import { getHealth } from '../services/api'

export function useHealthCheck() {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading')

  useEffect(() => {
    getHealth().then(() => setStatus('online')).catch(() => setStatus('offline'))
  }, [])

  return status
}

