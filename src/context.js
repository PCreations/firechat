import { createUsersModel, createMessagesModel } from './models';
import { createFirebaseConnector } from './connectors';
import config from './firebaseConfig';

const firebaseConnector = createFirebaseConnector(config);

const context = {
  Users: createUsersModel(firebaseConnector),
  Messages: createMessagesModel(firebaseConnector),
};

export default context;