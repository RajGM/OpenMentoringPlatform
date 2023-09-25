import { db, auth, arrayPush, serverTimestamp } from '../firebaseAdmin/index';

export default async function handler(req, res) {
    console.log("Getting REQUEST");

    try {
        const decodedToken = await auth.verifyIdToken(req.headers.authorization);
        console.log("INSIDE DECODED TOKEN");

        const docRef = db.collection('userchats').doc(req.body.user.uid);
        const docRefusr1 = db.collection('users').doc(req.body.user.uid);
        const docRef2 = db.collection('userchats').doc(req.body.user2);
        const docRefusr2 = db.collection('users').doc(req.body.user2);

        const newFriend1 = {
            chatId: req.body.combinedId,
            reference: docRefusr2,
        };

        const newFriend2 = {
            chatId: req.body.combinedId,
            reference: docRefusr1,
        };

        const batch = db.batch();

        const doc1 = await docRef.get();
        if (doc1.exists) {
            batch.update(docRef, {
                friends: arrayPush(newFriend1),
            });
            console.log("Document data:", doc1.data());
        } else {
            batch.set(docRef, {
                friends: arrayPush(newFriend1),
            });
            console.log("No such document!");
        }

        const doc2 = await docRef2.get();
        if (doc2.exists) {
            batch.update(docRef2, {
                friends: arrayPush(newFriend2),
            });
            console.log("Document data:", doc2.data());
        } else {
            batch.set(docRef2, {
                friends: arrayPush(newFriend2),
            });
            console.log("No such document!");
        }

        const ref = db.collection("chats").doc(req.body.combinedId);
        const msgRef = ref.collection("messages");
        const newMessageData = {
            text: "Hello",
            createdAt: serverTimestamp(),
            user: req.body.user.uid,
        };

        const msgDoc = await msgRef.get();
        if (msgDoc.exists) {
            batch.add(msgDoc.ref, {
                newMessageData,
            });
            console.log("Document data:", msgDoc.data());
        } else {
            batch.set(msgRef.doc(), {
                newMessageData,
            });
            console.log("No such document MSGREF!");
        }

        await batch.commit();

        res.status(200).send({ success: "Auth Done" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}
