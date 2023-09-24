import { db, auth, writeToFirestore } from "../firebaseAdmin/index";

import { addCalendarEvent } from "../calendar";
import { findMemberId, sendMessage } from "../serverSideAdmin/index";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {

  if (!req.headers.authorization) {
    res.status(400).send({ error: "Authorization header missing" });
    return;
  }

  await auth
    .verifyIdToken(req.headers.authorization)
    .then(async (decodedToken) => {
      const userSocial = await getSocial(req.body.postedBy);
      const values = req.body;
      const category = req.headers.category;
      let newCalID = undefined;
      let newDiscordMessageID = undefined;
      let logoUrl = undefined;

      newCalID = addCalendarEvent(
        values.eventN,
        values.link,
        values.appS,
        values.appE,
        category
      );
      logoUrl = fetchLogo(values.link);

      if (userSocial && userSocial.discordID) {
        newDiscordMessageID = sendMessage(
          values,
          userSocial.discordID,
          category
        );
      } else if (userSocial && userSocial.discord) {
        const foundDiscordID = await findMemberId(userSocial.discord);

        if (foundDiscordID) {
          newDiscordMessageID = sendMessage(values, foundDiscordID, category);
        } else {
          newDiscordMessageID = sendMessage(values, undefined, category);
        }
      } else {
        newDiscordMessageID = sendMessage(
          values,
          userSocial.discordID,
          category
        );
      }

      const allId = await Promise.all([newCalID, newDiscordMessageID, logoUrl]);
      values.calID = allId[0];
      values.discordMessageID = allId[1];

      if (allId[2]) {
        values.logoUrl = allId[2];
      } else {
        values.logoUrl = "https://www.infiopp.com/favicon.ico";
      }

      const firebaseID = await writeToFirestore(category, values);
      if (firebaseID) {
        //Add a document to voting collection
        db.collection("voting").doc(firebaseID).set({
          voters: [],
          voteCount: 0,
          close: [],
          closeCount: 0,
        });
      } else {
        res.status(200).send({ error: "Facing erros, please try later" });
        return;
      }

      res.status(200).send({ success: `${values.eventN} ADDED` });
    })
    .catch((error) => {
      res.status(200).send({ error: "Authorization Failed" });
    });
}

type DocumentData = {
  [key: string]: any;
};

async function getSocial(username: string): Promise<DocumentData | undefined> {
  try {
      const doc = await db.collection("usernames").doc(username).get();
      if (doc.exists) {
          return doc.data() as DocumentData;
      } else {
          console.log("No such document!");
          return undefined;
      }
  } catch (error) {
      console.log("Error getting document:", error);
      return undefined;
  }
}

async function fetchLogo(url: string): Promise<string | null> {
  const possibleLogoUrls: string[] = [
    `${url}/favicon.svg`,
    `${url}/favicon.png`,
    `${url}/favicon.ico`,
    `${url}/logo.png`,
    `${url}/logo.svg`,
  ];

  const promises: Promise<string | null>[] = possibleLogoUrls.map(
    async (logoUrl) => {
      try {
        const response = await fetch(logoUrl);
        if (response.status === 200) {
          return logoUrl;
        } else {
          return null;
        }
      } catch (error) {
        return null;
      }
    }
  );

  const results: (string | null)[] = await Promise.all(promises);

  for (const result of results) {
    if (result) {
      return result;
    }
  }

  return null;
}
