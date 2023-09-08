const oppTypes=["Hackathon","Grants","Conference","Internships"];

async function movePastEvents(opp) {
    const collectionRef = db.collection(opp); // Use the name of your collection
    const result = opp.concat("Archieve");
    const archieveCollectionRef = db.collection(result);

    const currentDate = new Date();

    const formattedDate = format(currentDate, 'yyyy-MM-dd');

    try {
        const snapshot = await collectionRef.get();

        const moveBatch = db.batch();

        const querySnapshot = await collectionRef.where('appE', '<', formattedDate).get();
        
        querySnapshot.forEach(doc => {
            moveBatch.set(archieveCollectionRef.doc(doc.id), doc.data());
        });

        await moveBatch.commit();

        const deleteBatch = db.batch();

        querySnapshot.forEach((doc) => {
            deleteBatch.delete(doc.ref);
        });

        await deleteBatch.commit();

        console.log('Hackathons with past appE dates moved successfully');
    } catch (error) {
        console.error('Error removing documents:', error);
    }
}

async function movePastEventsAll(){

    for (let i = 0; i < oppTypes.length; i++) {
        movePastEvents(oppTypes[i]);
    }

}

movePastEventsAll();