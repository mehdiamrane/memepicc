const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { decode } = require("utils/base64");

const serviceAccount = JSON.parse(decode(process.env.BASE64_SERVICE_ACCOUNT));

const admin = require("firebase-admin");

let app;
if (admin.apps.length === 0) {
  app = initializeApp({
    credential: cert(serviceAccount),
  });
}

export const db = getFirestore(app);
export const auth = getAuth(app);
