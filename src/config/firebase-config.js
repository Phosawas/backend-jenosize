
// var admin = require("firebase-admin");
import admin from "firebase-admin"
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

export default admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
