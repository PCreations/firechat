import ApolloLink from 'apollo-link';
import Observable from 'zen-observable-ts';
import { print } from 'graphql/language/printer';



class WebWorkerLink extends ApolloLink {
  promiseWorker = null;
  constructor({ promiseWorker }) {
    super();
    this.promiseWorker = promiseWorker;
  }
  request(operation) {
    console.log(operation);
    return new Observable(observer => {
      this.promiseWorker.postMessage(operation)
        .then(data => {
          console.log('DATA', data);
          observer.next(data);
          observer.complete();
        })
        .catch(observer.error.bind(observer));
    });
  }
}

export default ({ promiseWorker }) => new WebWorkerLink({ promiseWorker });