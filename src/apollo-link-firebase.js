import ApolloLink from 'apollo-link';
import PromiseWorker from 'promise-worker';
import Observable from 'zen-observable-ts';
import { print } from 'graphql/language/printer';

const GraphqlWorker = require('./worker.js');
const worker = new GraphqlWorker();
const promiseWorker = new PromiseWorker(worker);

export default class FirebaseLink extends ApolloLink {
  request(operation) {
    console.log(operation);
    return new Observable(observer => {
      promiseWorker.postMessage(operation)
        .then(data => {
          console.log('DATA', data);
          observer.next(data);
          observer.complete();
        })
        .catch(observer.error.bind(observer));
    });
  }
}