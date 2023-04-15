// const admin = require('../config/firebase-config');
import admin from '../config/firebase-config.js'
class Middleware {
  async decodeToken(req, res, next) {
    try {
      console.log(req.headers)
      const token = req.headers.authorization.split(' ')[1];
      const decodeValue = await admin.auth().verifyIdToken(token);
      if (decodeValue) {
        console.log(decodeValue);
        return next();
      }
      return res.json({ message: 'Unauthorized' });
    } catch (e) {
      return res.json({ message: 'Internal Error' });
    }
  }
}
const middleware = new Middleware();
export default middleware