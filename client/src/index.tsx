import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { render } from 'react-dom';
import { Listings } from './sections';
import * as serviceWorker from './serviceWorker';
import './styles/index.css';

const client = new ApolloClient({
  uri: 'http://localhost:9000/api'
});

render(
  <ApolloProvider client={client}>
    <Listings title="HomeChange Listings" />
  </ApolloProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
