import { createUsersModel, createMessagesModel } from './models';
import { createFirebaseConnector } from './connectors';
import { db } from './firebase';

const firebaseConnector = createFirebaseConnector(db);

const context = {
  Users: createUsersModel(firebaseConnector),
  Messages: createMessagesModel(firebaseConnector),
};

export default context;