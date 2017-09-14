export const createFirebaseConnector = db => {
 
  return {
    load(path) {
      return db.ref(path).once('value').then(snp => snp.val());
    },
    loadAll(path) {
      return db.ref(path).once('value').then(snp => Object.keys(snp.val()).map(key => snp.val()[key]));
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