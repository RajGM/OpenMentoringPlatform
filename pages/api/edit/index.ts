// @ts-nocheck
import { NextApiRequest, NextApiResponse } from "next";

import { firestore } from "@lib/firebase";

import { db, auth, updateToFirestore } from "../firebaseAdmin/index";

import { addCalendarEvent, editCalendarEvent } from "../calendar";
import {
  findMemberId,
  sendMessage,
  editMessage,
} from "../serverSideAdmin/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await auth
    .verifyIdToken(req.headers.authorization as string)
    .then(async (decodedToken) => {
      const userSocial = await getSocial(req.body.postedBy);
      const values = req.body;
      const category = req.headers.category as string;
      const firestoreid = req.headers.firestoreid as string;
      let newCalID: any = undefined;
      let newDiscordMessageID: any = undefined;

      if (req.body.calID == 0) {
        newCalID = addCalendarEvent(
          values.eventN,
          values.link,
          values.appS,
          values.appE,
          category
        );
      } else {
        newCalID = editCalendarEvent(
          values.calID,
          values.eventN,
          values.link,
          values.appS,
          values.appE,
          category
        );
      }

      if (userSocial && userSocial.discordID) {
        if (values.discordMessageID == 0) {
          newDiscordMessageID = sendMessage(
            values,
            userSocial.discordID,
            category
          );
        } else {
          newDiscordMessageID = editMessage(
            values,
            userSocial.discordID,
            category,
            values.discordMessageID
          );
        }
      } else if (userSocial && userSocial.discord) {
        const foundDiscordID = await findMemberId(userSocial.discord);

        if (foundDiscordID) {
          if (values.discordMessageID == 0) {
            newDiscordMessageID = sendMessage(values, foundDiscordID, category);
          } else {
            newDiscordMessageID = editMessage(
              values,
              foundDiscordID,
              category,
              values.discordMessageID
            );
          }
        } else {
          if (values.discordMessageID == 0) {
            newDiscordMessageID = sendMessage(values, undefined, category);
          } else {
            newDiscordMessageID = editMessage(
              values,
              undefined,
              category,
              values.discordMessageID
            );
          }
        }
      } else {
        if (values.discordMessageID == 0) {
          newDiscordMessageID = sendMessage(values, undefined, category);
        } else {
          newDiscordMessageID = editMessage(
            values,
            undefined,
            category,
            values.discordMessageID
          );
        }
      }

      const allId = await Promise.all([newCalID, newDiscordMessageID]);
      values.calID = allId[0];
      values.discordMessageID = allId[1];

      updateToFirestore(category, values, firestoreid);

      res.status(200).send({ success: "Hack Updated" });
    })
    .catch((error) => {
      res.status(401).send({ error: "UnAuthorized" });
    });
}

async function getSocial(username: string) {
  let document:any = undefined;
  await firestore
    .collection("usernames")
    .doc(username)
    .get()
    .then((doc) => {
      if (doc.exists) {
        document = doc.data();
      } else {
        // doc.data() will be undefined in this case
        document = undefined;
      }
    })
    .catch((error) => {
      return undefined;
    });

  return document;
}
