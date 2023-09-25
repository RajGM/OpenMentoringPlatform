import { db, auth, writeToFirestore, arrayPush } from "../firebaseAdmin/index";
import { createICS, to24HourFormat } from "@lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    
    if (!req.headers.authorization) {
        return res.status(400).send({ error: "Authorization header missing" });
    }

    try {
        const decodedToken = await auth.verifyIdToken(req.headers.authorization);
        const values = req.body;

        const userRef = db.collection("usernames").doc(values.mentor);
        const userDoc = await userRef.get();
        const uid = userDoc.data()?.uid;
        const userRecord = await auth.getUser(uid);

        const icsEvent = createICS({
            start: values.start,
            end: values.end,
            summary: values.summary,
            description: values.description,
            location: values.location,
        });

        const batch = db.batch();
        const base64Ics = btoa(icsEvent);
        const docRefMail = db.collection("mail").doc();

        const emailData = {
            to: [decodedToken.email, userRecord.email, values.enteredEmail],
            message: {
                html: values.description,
                subject: values.description,
                text: values.description,
                attachments: [
                    {
                        filename: "invite.ics",
                        content: base64Ics,
                        encoding: "base64",
                        type: "text/calendar",
                    },
                ],
            },
        };

        batch.set(docRefMail, emailData);

        const docRefBooking = db.collection("users").doc(userRecord.uid).collection("booking").doc(values.date);
        const slotData = {
            slots: arrayPush({
                startTime: to24HourFormat(values.startTime),
                endTime: to24HourFormat(values.endTime),
            }),
        };

        batch.set(docRefBooking, slotData, { merge: true });

        await batch.commit();
        return res.status(200).send({ success: `${values.eventN} ADDED` });
    } catch (error) {
        console.error("Error in booking:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
}

