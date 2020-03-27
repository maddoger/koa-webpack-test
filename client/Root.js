import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import LanguageProvider from './LanguageProvider'
import App from './App'

const Root = () => {
  return (
    <LanguageProvider value="ru">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default Root