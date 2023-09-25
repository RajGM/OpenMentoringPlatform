// @ts-nocheck
import { firestore, auth } from "../firebaseAdmin/index"; // Make sure you import firestore correctly

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
    const decodedToken = await auth.verifyIdToken(req.headers.authorization);

    // Extract the necessary data from the request body
    const { postId, username, uid } = req.body;

    // Delete the document in the "posts" collection and the user's "posts" subcollection
    const postRef = firestore.collection("posts").doc(postId);
    const userPostRef = firestore.collection("users").doc(uid).collection("posts").doc(postId);

    // Check if the "posts" document has the correct "username" field
    const postDoc = await postRef.get();
    if (postDoc.exists) {
      const postData = postDoc.data();
      if (postData.username === username) {
        // Username matches, proceed with the deletion
        await postRef.delete();
        await userPostRef.delete();
        res.status(200).send({ success: `POST DELETED` });
      } else {
        res.status(400).send({ error: "Username mismatch" });
      }
    } else {
      res.status(404).send({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Authorization Failed" });
  }
}
