import ApolloClient from 'apollo-client';
import InMemoryCache from 'apollo-cache-inmemory';
import { ApolloLink, SetContextLink } from 'apollo-link';

import FirebaseLink from './apollo-link-firebase';
const dataIdFromObject = result => result.id;

const cache = new InMemoryCache({
  connectToDevTools: true,
  dataIdFromObject,
});

const getAuthContext = () => {
  const auth = window.localStorage.getItem('firechatAuth');
  if (auth !== null) {
    return { auth };
  }
  return null
}

const link = ApolloLink.from([
  new SetContextLink(getAuthContext),
  new FirebaseLink()
]);


const client = new ApolloClient({
  cache,
  link,
});

export default client;