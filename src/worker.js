import { execute } from 'graphql';

import schema from './schema';
import context from './context';

const registerPromiseWorker = require('promise-worker/register');

registerPromiseWorker(request => {
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
    return data;
  });
})