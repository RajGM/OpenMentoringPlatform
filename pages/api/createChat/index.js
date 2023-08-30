import { db, auth, arrayPush } from '../firebaseAdmin/index'

export default async function handler(req, res) {

    console.log("Getting REQUEST")

    await auth.verifyIdToken(req.headers.authorization)
        .then(async (decodedToken) => {

            console.log("INSIDE DECODED TOKEN")

            try {
                const docRef = db.collection('userchats').doc(req.body.user.uid);
                const docRef2 = db.collection('userchats').doc(req.body.user2);

                const batch = db.batch();

                // Update documents in the batch
                batch.set(docRef, {
                    chatId: arrayPush(req.body.combinedId)
                });

                batch.set(docRef2, {
                    chatId: arrayPush(req.body.combinedId)
                });
                await batch.commit();

            } catch (err) {
                console.log(err)
            }

            res.status(200).send({ success: `Auth Done` });

        })
        .catch((error) => {
            res.status(200).send({ error: 'Authorization Failed' });
        });

}