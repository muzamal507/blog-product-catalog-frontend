import React, { createContext, useContext, useState, useEffect } from 'react'
import settingService from '../services/settingService'

const SettingContext = createContext(null)

export function SettingProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    settingService.getPublic()
      .then(res => {
        const data = res.data.data
        // Could be array or single object
        const s = Array.isArray(data) ? data[0] : data
        setSettings(s || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <SettingContext.Provider value={{ settings, loading }}>
      {children}
    </SettingContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingContext)
}