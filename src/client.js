import { ApolloClient } from 'react-apollo';
import PromiseWorker from 'promise-worker';

const GraphqlWorker = require('./worker.js');
const worker = new GraphqlWorker();
const promiseWorker = new PromiseWorker(worker);

const dataIdFromObject = result => result.id;
const networkInterface = {
  query: (request) => {
    request.auth = window.localStorage.getItem('firechatAuth');
    return promiseWorker.postMessage(request);
  }
};

const client = new ApolloClient({
  connectToDevTools: true,
  dataIdFromObject,
  networkInterface,
});

export default client;