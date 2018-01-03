import React, { Component } from 'react';

import { withRouter } from 'react-router'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { observer, inject, Provider } from 'mobx-react';

import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Generate from './pages/Generate';
import mainStoreConstructor from './stores/main'


const mainStore = new mainStoreConstructor()
class App extends Component {
  render() {
    return (
      <Provider mainStore={mainStore}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </Provider>
    );
  }
}

@inject('mainStore')
@withRouter
@observer
class Router extends Component {
  render() {
    const { mainStore } = this.props
    const { user } = mainStore
    return (

      <Switch>
        <Route path="/sign-up"

          render={(props) => user
            ? <Redirect to={{ pathname: '/', state: { from: props.location } }} />
            : <Signup {...props} />}
        />


        <Route path="/sign-in"
          render={(props) => user
            ? <Redirect to={{ pathname: '/', state: { from: props.location } }} />
            : <Signin {...props} />}
        />
        />

          <Route path="/"
          render={(props) => user
            ? <Generate {...props} />
            : <Redirect to={{ pathname: '/sign-in', state: { from: props.location } }} />}
        />

      </Switch>

    );
  }
}



export default App;
