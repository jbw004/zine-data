const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.onNewIssueAdded = functions.firestore
    .document("zines/{zineId}/issues/{issueId}")
    .onCreate(async (snap, context) => {
      const zineId = context.params.zineId;

      try {
        console.log("Checking followers for zine:", zineId);

        // First get the zine document to get its name
        const zineDoc = await admin.firestore()
            .collection("zines")
            .doc(zineId)
            .get();

        if (!zineDoc.exists) {
          console.log("Zine document not found");
          return null;
        }

        const zineName = zineDoc.data().name;

        // Get all users following this zine using zineName
        const followersSnapshot = await admin.firestore()
            .collectionGroup("followed_zines")
            .where("zineName", "==", zineName)
            .get();

        console.log(
            "Found followers:",
            followersSnapshot.docs.length,
        );

        return null;
      } catch (error) {
        console.error("Error processing new issue:", error);
        return null;
      }
    });
