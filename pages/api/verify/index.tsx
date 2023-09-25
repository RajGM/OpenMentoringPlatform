import { db, auth, writeToFirestore } from "../firebaseAdmin/index";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (!req.headers.authorization) {
    res.status(400).send({ error: "Authorization header missing" });
    return;
  }

  try {
    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(req.headers.authorization);

    // Extract the email from the decoded token
    const userEmail = decodedToken.email;

    // Extract the domain from the email
    const emailDomain = userEmail.split("@")[1];

    // Check if a document exists in Firestore with a matching "domain"
    const querySnapshot = await db
      .collection("university")
      .where("domain", "==", emailDomain)
      .get();

    if (!querySnapshot.empty) {
      // Document with matching "domain" found in Firestore
      // Update the user document to set "mentor" as true
      await db.collection("users").doc(decodedToken.uid).update({
        mentor: true,
      });

      res.status(200).send({ success: "ADDED" });
    } else {
      // No matching document found in Firestore
      res.status(400).send({ error: "No matching university domain found" });
    }
  } catch (error) {
    console.error("Authorization Failed:", error);
    res.status(401).send({ error: "Authorization Failed" });
  }
}
