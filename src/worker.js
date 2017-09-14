import { execute } from 'graphql';
import * as firebase from 'firebase';

import schema from './schema';
import context from './context';
import { auth } from './firebase';

const registerPromiseWorker = require('promise-worker/register');

registerPromiseWorker(request => {
  return new Promise(resolve => {
    if (auth.currentUser === null) {
      const credential = firebase.auth.GithubAuthProvider.credential(request.context.auth.credential);
      firebase.auth()
        .signInWithCredential(credential)
        .then(() => {
          return execute(
            schema,
            request.query,
            {},
            Object.assign({}, request.context || {}, context),
            request.variables,
            request.operationName
          ).then(data => {
            console.log('WORKER USER', auth.currentUser);
            if (data.errors) { console.error(data.errors[0]) }
            resolve(data);
          });
        })
    } else {
      console.log(request);
      return execute(
        schema,
        request.query,
        {},
        Object.assign({}, request.context || {}, context),
        request.variables,
        request.operationName
      ).then(data => {
        if (data.errors) { console.error(data.errors[0]) }
        resolve(data);
      });
    }
  });
});