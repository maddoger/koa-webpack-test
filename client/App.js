import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'

import { useLanguage } from './LanguageProvider'
import image from './assets/test.jpg'


const App = () => {
  const language = useLanguage()

  return (
    <div>
      <h1>Hello from App</h1>
      <h3>Language: {language}</h3>
      <Switch>
        <Route path="/" exact>
          Index page<br />
          <Link to="/image">go to image page</Link>
        </Route>
        <Route path="/image" exact>
          <img src={image} />
        </Route>
      </Switch>
    </div>
  )
}

export default App