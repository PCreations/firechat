import { ApolloClient } from 'apollo-client';
import InMemoryCache from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { auth } from './firebase';
import { createWebWorkerLink } from 'apollo-link-webworker';

const GraphqlWorker = require('./worker.js');

const worker = new GraphqlWorker();

const webWorkerLink = createWebWorkerLink({ worker });

const dataIdFromObject = result => result.id;

const cache = new InMemoryCache({
  dataIdFromObject,
  connectToDevTools: true,
});

const getAuthContext = () => {
  const authUser = auth.currentUser;
  if (authUser !== null) {
    return {
      auth: {
        uid: authUser.uid,
        credential: window.localStorage.getItem('firechatCredential'),
      },
    };
  }
  return {};
};

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([new ApolloLink((operation, forward) => {
    operation.context = {
      ...getAuthContext(),
    };
    return forward(operation);
  }), webWorkerLink]),
});

window.__APOLLO_CLIENT__ = client;

export default client;