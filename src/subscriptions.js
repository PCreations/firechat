export const initSubscriptions = ({ pubsub, db }) => {
  let newMessage = false;
  db.ref('/messages/').on('child_added', snapshot => {
    if (newMessage) {
      pubsub.publish('onMessageAdded', snapshot.val());
    }
  });
  db.ref('/messages/').once('value', snapshot => {
    newMessage = true;
  });
};