import { firestore } from '@lib/firebase';

import { db, auth,updateToFirestore } from '../firebaseAdmin/index'

import { addCalendarEvent, editCalendarEvent } from '../calendar';
import { findMemberId, sendMessage, editMessage } from '../serverSideAdmin/index';

export default async function handler(req, res) {

    await auth.verifyIdToken(req.headers.authorization)
        .then(async (decodedToken) => {

            const userSocial = await getSocial(req.body.postedBy);
            const values = req.body;
            const category = req.headers.category;
            const firestoreid = req.headers.firestoreid;
            let newCalID = undefined;
            let newDiscordMessageID = undefined;

            if (req.body.calID == 0) {
                newCalID = addCalendarEvent(values.eventN, values.link, values.appS, values.appE, category);
            } else {
                newCalID = editCalendarEvent(values.calID, values.eventN, values.link, values.appS, values.appE, category);
            }

            if (userSocial && userSocial.discordID) {

                if (values.discordMessageID == 0) {
                    newDiscordMessageID = sendMessage(values, userSocial.discordID, category);
                } else {
                    newDiscordMessageID = editMessage(values, userSocial.discordID, category,values.discordMessageID);
                }

            } else if (userSocial&& userSocial.discord) {

                const foundDiscordID = await findMemberId(userSocial.discord);
                
                if (foundDiscordID) {
                    if (values.discordMessageID == 0) {
                        newDiscordMessageID = sendMessage(values, foundDiscordID, category);
                    } else {
                        newDiscordMessageID = editMessage(values, foundDiscordID, category, values.discordMessageID);
                    }
                } else {
                    if (values.discordMessageID == 0) {
                        newDiscordMessageID = sendMessage(values, undefined, category);
                    } else {
                        newDiscordMessageID = editMessage(values, undefined, category,values.discordMessageID);
                    }
                }

            } else {

                if (values.discordMessageID == 0) {
                    newDiscordMessageID = sendMessage(values, undefined, category);
                } else {
                    newDiscordMessageID = editMessage(values, undefined, category,values.discordMessageID);
                }

            }

            const allId = await Promise.all([newCalID, newDiscordMessageID]);
            values.calID = allId[0];
            values.discordMessageID = allId[1];

            updateToFirestore(category,values,firestoreid)

            res.status(200).send({ success: 'Hack Updated' });
        })
        .catch((error) => {
            console.log(error);
            res.status(401).send({ error: "UnAuthorized" });
        });

}

async function getSocial(username:string) {
    let document = undefined;
    await firestore.collection('usernames').doc(username).get().then((doc) => {
        if (doc.exists) {
            document = doc.data();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            document = undefined;
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
        return undefined;
    });

    return document;
}