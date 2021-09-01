const express = require("express");
const router = express.Router();
const cors = require("cors");
var admin = require("firebase-admin");

var serviceAccount = require("./serverless-demo-4b5cb-firebase-adminsdk-ie17g-160ae6e2db.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

router.post("/verifyToken", cors(), (req, res) => {
  idToken = req.body.token;
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      return res
        .status(200)
        .json({ status: "success", message: "valid token" });
    })
    .catch((error) => {
      // Handle error
      return res.status(400).json(error);
    });
});

module.exports = router;
