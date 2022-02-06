/* eslint-disable no-underscore-dangle */
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { decrypt } = require("services/api/decrypt");
const admin = require("firebase-admin");
const serviceAccount = require("../../service-account.enc");

const decryptedServiceAccount = decrypt({
  encrypted: serviceAccount.encrypted,
});

let app;
if (admin.apps.length === 0) {
  app = initializeApp({
    credential: cert(decryptedServiceAccount),
  });
}

const db = getFirestore(app);

if (!db._settings.ignoreUndefinedProperties) {
  db.settings({
    ignoreUndefinedProperties: true,
  });
}

export { db };

export const auth = getAuth(app);
