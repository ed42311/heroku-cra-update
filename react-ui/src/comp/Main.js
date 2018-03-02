import React from 'react';
import { Switch, Route } from 'react-router-dom'
import ApiTest from './ApiTest'
import FeatureTest from './FeatureTest'

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={ApiTest}/>
      <Route exact path='/feature' component={FeatureTest}/>
    </Switch>
  </main>
)

export default Main;
