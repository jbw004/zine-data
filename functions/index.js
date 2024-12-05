const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.onNewIssueAdded = functions.firestore
    .document("zines/{zineId}/issues/{issueId}")
    .onCreate(async (snap, context) => {
      const zineId = context.params.zineId;
      const issueId = context.params.issueId;

      try {
        console.log("Starting function for zineId:", zineId);

        // Get the zine document
        const zineDoc = await admin.firestore()
            .collection("zines")
            .doc(zineId)
            .get();

        if (!zineDoc.exists) {
          console.log("No zine document found");
          return null;
        }

        const zineName = zineDoc.data().name;
        const topic = `zine_${zineId}`;

        // 1. Send the notification
        const message = {
          notification: {
            title: "New Zines!",
            body: `${zineName} has just published a new issue!`,
          },
          data: {
            zine_id: zineId,
            issue_id: issueId,
            click_action: "FLUTTER_NOTIFICATION_CLICK",
          },
          topic: topic,
        };

        await admin.messaging().send(message);
        console.log(`Notification sent to topic: ${topic}`);

        // 2. Update all followers' unread status
        const followersSnapshot = await admin.firestore()
            .collectionGroup("followed_zines")
            .where("zineName", "==", zineName)
            .get();

        const batch = admin.firestore().batch();
        followersSnapshot.docs.forEach((doc) => {
          batch.update(doc.ref, {
            hasUnreadIssues: true,
          });
        });

        await batch.commit();
        console.log(
            `Updated unread status for ${followersSnapshot.size} followers`,
        );

        return null;
      } catch (error) {
        console.error("Error:", error);
        return null;
      }
    });
