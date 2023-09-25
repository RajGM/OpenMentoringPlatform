// @ts-nocheck
import {db,firestore} from '../firebaseAdmin'

const oppTypes: string[] = ["Hackathon", "Grants", "Conference", "Internships"];

async function movePastEvents(opp: string): Promise<void> {
    const collectionRef = db.collection(opp); // Use the name of your collection
    const result: string = opp.concat("Archieve");
    const archieveCollectionRef = db.collection(result);

    const currentDate: Date = new Date();

    const formattedDate: string = format(currentDate, 'yyyy-MM-dd');

    try {
        const snapshot: firestore.QuerySnapshot = await collectionRef.get();

        const moveBatch: firestore.WriteBatch = db.batch();

        const querySnapshot: firestore.QuerySnapshot = await collectionRef.where('appE', '<', formattedDate).get();

        querySnapshot.forEach((doc: firestore.QueryDocumentSnapshot) => {
            moveBatch.set(archieveCollectionRef.doc(doc.id), doc.data());
        });

        await moveBatch.commit();

        const deleteBatch: firestore.WriteBatch = db.batch();

        querySnapshot.forEach((doc: firestore.QueryDocumentSnapshot) => {
            deleteBatch.delete(doc.ref);
        });

        await deleteBatch.commit();

    } catch (error) {
        console.error('Error removing documents:', error);
    }
}

async function movePastEventsAll(): Promise<void> {
    const promises: Promise<void>[] = oppTypes.map(opp => movePastEvents(opp));
    await Promise.all(promises);
}

movePastEventsAll();