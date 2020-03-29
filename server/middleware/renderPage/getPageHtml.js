import React from 'react'
import ReactDOM from 'react-dom/server'
import { StaticRouter } from 'react-router'

import LanguageProvider from 'client/LanguageProvider'
import App from 'client/App'


const getPageHtml = async (ctx) => {
  const routerContext = {}
  
  const pageHtml = ReactDOM.renderToString(
    <LanguageProvider value="ru">
      <StaticRouter location={ctx.request.path} context={routerContext}>
        <App />
      </StaticRouter>
    </LanguageProvider>    
  )

  return pageHtml
}


export default getPageHtml
