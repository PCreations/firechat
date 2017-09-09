export const createUsersModel = firebaseConnector => ({
  getById: id => firebaseConnector.load(`/users/${id}`),
  create: user => firebaseConnector
    .save(`/users/${user.id}`, user)
    .then(() => user.id),
});

export const createMessagesModel = firebaseConnector => ({
  getAll: () => firebaseConnector.loadAll('/messages/'),
  create: payload => firebaseConnector.push('/messages/', payload)
});

