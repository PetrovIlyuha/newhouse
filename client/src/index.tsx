import React, { useState } from 'react';
import ApolloClient from 'apollo-boost';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { render } from 'react-dom';
import { Listings } from './sections/Listings';
import { NotFound } from './sections/NotFound';
import { User } from './sections/User';
import { Listing } from './sections/Listing';
import { Host } from './sections/Host';
import { Home } from './sections/Home';
import { Login } from './sections/Login';
import * as serviceWorker from './serviceWorker';
import { Layout } from 'antd';
import './styles/index.css';
import { Viewer } from './lib/types';

const client = new ApolloClient({
  uri: 'http://localhost:9000/api'
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false
};
const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  return (
    <Router>
      <Layout id="app">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/host" component={Host} />
          <Route exact path="/listing/:id" component={Listing} />
          <Route exact path="/listings/:location?" component={Listings} />
          <Route
            exact
            path="/login"
            render={props => <Login {...props} setViewer={setViewer} />}
          />
          <Route exact path="/user/:id" component={User} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};
render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
