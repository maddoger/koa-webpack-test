import getPageHtml from './getPageHtml'

// returns client scripts
const getScripts = (ctx) => {
  const { assets } = ctx.state

  // add all scripts
  const scripts = [
    assets.client.js
  ]

  return scripts.map((src) => `<script src="${src}"></script>`).join('')
}

const getHeader = async (ctx) => {
  return `
    <head>
      <title>SSR Test</title>
    </head>
  `
}

const getBody = async (ctx) => {
  return `
    <body>
      <div id="root">${await getPageHtml(ctx)}</div>
      ${await getScripts(ctx)}
    </body>
  `
}

const renderPage = async (ctx) => {
  ctx.body = `
    <!DOCTYPE html>
    <html lang="en">
      ${await getHeader(ctx)}
      ${await getBody(ctx)}
    </html>
  `
}


export default renderPage