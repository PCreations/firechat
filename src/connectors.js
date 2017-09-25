import pubsub from './pubsub';
import DataLoader from 'dataloader';

import client from './client';
import GET_MESSAGES_QUERY from './GetMessages.graphql';


export const createFirebaseConnector = db => {
  const firebaseLoader = new DataLoader(
    keys => keys.map(
      key => db.ref(key).once('value').then(snp => snp.val())
    ));
    
  // subscriptions && dataloader cache management
  let newMessage = false;
  db.ref('/messages/').on('child_added', snapshot => {
    if (newMessage === true) {
      firebaseLoader.clear(`/messages/${snapshot.key}`);
      firebaseLoader.prime(`/messages/${snapshot.key}`, snapshot.val());
      pubsub.publish('OnMessageAdded', {
        messageAdded: snapshot.val()
      });
    }
  });
  db.ref('/messages/').once('value').then(snapshot => {
    const messages = snapshot.val() || {};
    Object.keys(messages).map(id => firebaseLoader.prime(`/messages/${id}`, messages[id]));
    newMessage = true;
  });

  db.ref('/users/').on('child_added', snapshot => {
      firebaseLoader.clear(`/users/${snapshot.key}`);
      firebaseLoader.prime(`/users/${snapshot.key}`, snapshot.val());
  });
  
  return {
    load: firebaseLoader.load.bind(firebaseLoader),
    loadAll(path) {
      return db.ref(path)
        .once('value')
        .then(snp => Object.keys(snp.val() || {}).map(key => snp.val()[key]));
    },
    save(path, payload) {
      return db.ref(path).set(payload);
    },
    push(path, payload) {
      const thenableRef = db.ref(path).push();
      const message = {
        id: thenableRef.key,
        ...payload,
      };
      return thenableRef.set(message).then(() => message);
    },
  };
};