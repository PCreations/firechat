import { createUsersModel, createMessagesModel } from './models';
import { createFirebaseConnector } from './connectors';
import { initSubscriptions } from './subscriptions';
import { db } from './firebase';
import pubsub from './pubsub';

const firebaseConnector = createFirebaseConnector(db);
initSubscriptions({
  db,
  pubsub,
});

const context = {
  Users: createUsersModel(firebaseConnector),
  Messages: createMessagesModel(firebaseConnector),
};

export default context;