import * as firebase from 'firebase';
import { createWorker, handleSubscriptions } from 'apollo-link-webworker';

import schema from './schema';
import context from './context';
import pubsub from './pubsub';
import { auth } from './firebase';


const beforeExecute = request => {
  return new Promise(resolve => {
    if (auth.currentUser === null) {
      const credential = firebase.auth
        .GithubAuthProvider
        .credential(request.context.auth.credential);
      resolve(firebase.auth().signInWithCredential(credential));
    } else {
      resolve();
    }
  });
}

createWorker({
  schema,
  context,
  beforeExecute, 
});

/*self.onmessage = message => handleSubscriptions({
  self,
  message,
  schema,
  context,
  pubsub,
});*/