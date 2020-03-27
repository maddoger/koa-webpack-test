import React, { createContext, useContext } from 'react'

export const LanguageContext = createContext(null)

export const LanguageProvider = LanguageContext.Provider

export const useLanguage = () => useContext(LanguageContext)

export default LanguageProvider