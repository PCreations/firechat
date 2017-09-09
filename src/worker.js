import { execute } from 'graphql';

import schema from './schema';
import context from './context';

const registerPromiseWorker = require('promise-worker/register');

const getContext = request => {
  context.auth = request.auth;
  return context;
}

registerPromiseWorker(request => execute(
  schema,
  request.query,
  {},
  getContext(request),
  request.variables,
  request.operationName
).then(res => res).catch(error => ({
  data: null,
  errors: [error],
})));