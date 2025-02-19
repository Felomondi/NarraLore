const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.createUserProfile = functions.auth.user().onCreate((user) => {
  if (!user || !user.uid) {
    console.error("❌ Error: User data is undefined.");
    return null;
  }

  const userProfile = {
    displayName: user.displayName || "",
    email: user.email || "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastLogin: admin.firestore.FieldValue.serverTimestamp(),
    photoURL: user.photoURL || "",
  };

  return db.collection("users")
      .doc(user.uid)
      .set(userProfile)
      .then(() => {
        console.log(`✅ User profile created for ${user.uid}`);
        return null;
      })
      .catch((error) => {
        console.error("❌ Error creating user profile:", error);
        return null;
      });
});
