import ApolloClient from 'apollo-client';
import InMemoryCache from 'apollo-cache-inmemory';
import { ApolloLink, SetContextLink } from 'apollo-link';
import PromiseWorker from 'promise-worker';
import { auth } from './firebase';
import createFirebaseLink from './apollo-link-firebase';

const GraphqlWorker = require('./worker.js');

const worker = new GraphqlWorker();

const promiseWorker = new PromiseWorker(worker);

const dataIdFromObject = result => result.id;

const cache = new InMemoryCache({
  connectToDevTools: true,
  dataIdFromObject,
});

const getAuthContext = () => {
  const authUser = auth.currentUser;
  if (authUser !== null) {
    return { auth: authUser.uid };
  }
  return null
}

const link = ApolloLink.from([
  new SetContextLink(getAuthContext),
  createFirebaseLink({ promiseWorker }),
]);


const client = new ApolloClient({
  cache,
  link,
});

export default client;