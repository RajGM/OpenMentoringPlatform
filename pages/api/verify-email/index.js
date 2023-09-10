import { db, auth, writeToFirestore } from '../firebaseAdmin/index'

export default async function handler(req, res) {

    console.log("REQUEST HERE")

    await auth.verifyIdToken(req.headers.authorization)
        .then(async (decodedToken) => {

            console.log(req.body);

            const domainPattern = new RegExp(`${req.body.websiteDomain.replace('.', '\\.')}$`);

            console.log(domainPattern.test(req.body.email.split('@')[1]) || req.body.websiteDomain.includes(req.body.email.split('@')[1]));

            if (domainPattern.test(req.body.email.split('@')[1]) || req.body.websiteDomain.includes(req.body.email.split('@')[1])) {
                //call to firebase
                const mentorProfile = {
                    name: "John Doe",
                    expertise: "Web Development",
                    bio: "I'm an experienced web developer with a passion for teaching.",
                    islive: req.body.listMentor, // Set the islive field to true (or false)
                    university: "Example University", // Set the university field to the desired university name
                };

                // Reference to the "mentors" collection
                const mentorsCollection = db.collection("mentors"); // Use 'db' from your firebaseAdmin

                // Check if a mentor with the same user ID (document ID) exists
                const mentorDocRef = mentorsCollection.doc(decodedToken.uid);

                // Wait for Firestore operations to complete before sending the response
                await mentorDocRef.get().then(async (docSnapshot) => {
                    if (docSnapshot.exists) {
                        // Mentor with the same user ID (document ID) exists, update the existing document
                        await mentorDocRef.update(mentorProfile);
                    } else {
                        // Mentor with the same user ID (document ID) does not exist, create a new document
                        await mentorDocRef.set(mentorProfile);
                    }
                });

                res.status(200).send({ ok: 'Working', message: 'MESSAGE HERE' });
            } else {
                res.status(200).send({ error: 'Please use university email or raise a ticket' });
            }

        })
        .catch((error) => {
            res.status(200).send({ error: 'Authorization Failed' });
        });

}
