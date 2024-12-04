const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.onNewIssueAdded = functions.firestore
    .document("zines/{zineId}/issues/{issueId}")
    .onCreate(async (snap, context) => {
      console.log(
          "New issue added:",
          context.params.zineId,
          context.params.issueId,
      );
      return null;
    });
