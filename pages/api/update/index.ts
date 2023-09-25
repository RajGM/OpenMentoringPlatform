import { NextApiRequest, NextApiResponse } from 'next';
import { db, auth, arrayPush } from '../firebaseAdmin/index'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {

    await auth.verifyIdToken(req.headers.authorization as string)
        .then(async (decodedToken) => {

            const ref = db.collection('voting').doc(req.headers.firestoreid as string);
            const dataT = (await ref.get()).data();

            if (req.body.type == "vote") {

             
                if (!dataT?.voters.includes(req.body.username)) {
                    try {
                        const batch = db.batch();
                        batch.update(ref, {
                            voters: arrayPush(req.body.username)
                        });
                        batch.update(ref, {
                            voteCount: dataT?.voteCount + 1
                        });
                        await batch.commit();
                    } catch (error) {
                        console.error('Error updating document:', error);
                    }
                }


            } else if (req.body.type == "close") {


                if (!dataT?.close.includes(req.body.username)) {
                    try {
                        const batch = db.batch();
                        batch.update(ref, {
                            close: arrayPush(req.body.username)
                        });
                        batch.update(ref, {
                            closeCount: dataT?.closeCount + 1
                        });
                        await batch.commit();
                    } catch (error) {
                        console.error('Error updating document:', error);
                    }
                }


                if (dataT?.closeCount >= 9) {
                    const oppDataRef = db.collection(req.headers.category as string).doc(req.headers.firestoreid as string);
                    const dataOpp = (await oppDataRef.get()).data();

                    const closeCollectionPath = req.headers.category?.concat("Closed");
                    const closeCollectionRef = db.collection(closeCollectionPath as string);

                    const batch = db.batch();
                    batch.set(closeCollectionRef.doc(req.headers.firestoreid as string), dataOpp);
                    batch.delete(oppDataRef);
                    await batch.commit();
                }

            }

            res.status(200).send({ success: 'Authorization Success' });
        })
        .catch((error) => {
            res.status(200).send({ error: 'Authorization Failed' });
        });

}
