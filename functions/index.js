const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.onNewIssueAdded = functions.firestore
    .document("zines/{zineId}/issues/{issueId}")
    .onCreate(async (snap, context) => {
      const zineId = context.params.zineId;
      const issueId = context.params.issueId;
      const db = admin.firestore();

      try {
        console.log(`Processing new issue ${issueId} for zine ${zineId}`);

        // Get the zine document
        const zineDoc = await db.collection("zines").doc(zineId).get();

        if (!zineDoc.exists) {
          console.error(`Zine document ${zineId} not found`);
          return null;
        }

        const zineName = zineDoc.data().name;
        const topic = `zine_${zineId}`;

        // Send notification
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

        try {
          await admin.messaging().send(message);
          console.log(`Successfully sent notification to topic: ${topic}`);
        } catch (error) {
          console.error("Error sending notification:", error);
          // Continue execution even if notification fails
        }

        // Modified query to include sorting
        console.log(`Finding followers for zine: ${zineId}`);

        const followersQuery = db.collectionGroup("followed_zines")
            .where("zineId", "==", zineId)
            .orderBy("lastNotificationAt", "desc"); // Added this line

        const followersSnapshot = await followersQuery.get();
        console.log(`Found ${followersSnapshot.size} followers`);

        if (followersSnapshot.empty) {
          console.log("No followers found to update");
          return null;
        }

        // Update all follower documents
        const batch = db.batch();
        const timestamp = admin.firestore.FieldValue.serverTimestamp();

        followersSnapshot.docs.forEach((doc) => {
          console.log(`Updating follower document: ${doc.ref.path}`);
          batch.update(doc.ref, {
            lastNotificationAt: timestamp,
            hasUnreadIssues: true,
          });
        });

        await batch.commit();
        console.log(
            `Successfully updated ${followersSnapshot.size} follower documents`,
        );

        return null;
      } catch (error) {
        console.error("Function failed:", error);
        if (error.code === 9) { // FAILED_PRECONDITION
          console.error(
              "Indexes possibly missing. Ensure index created.",
          );
        }
        throw error; // Rethrowing to ensure proper error reporting
      }
    });
