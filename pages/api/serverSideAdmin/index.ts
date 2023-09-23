const token = "MTExOTY4NDM5OTIyMzU1NDA3OQ.GfXkGM.62X7MgR4JOrX-8Moy8ejeZCDSxSbg4hE04HQ0A";            
const generalChannelID = '1096841097231208571';
const serverID = "1096841096367177779";
const baseurl = 'https://discord.com/api';

const colors = {
    "Hackathon": {
        code: 16776960,
        color: "yellow"
    },
    "Internship": {
        code: 15105570,
        color: "orange"
    },
    "Conferences": {
        code: 5763719,
        color: "green"
    },
    "Grants": {
        code: 15277667,
        color: "pink"
    },
    "Default": {
        code: 1752220,
        color: "aqua"
    }
}

const allChannels = {
    Welcome: { 'id': '1096841097231208569', general: '1096841097231208571', 'get-roles': '1121770463278923787', announcement: '1121763370798940181', },
    Hackathon: {
        'id': '1121756472787877888', onsite: '1121756556527157289',
        remote: '1121756587548221531',
        hybrid: '1121756623078166548',
    },
    Grants: {
        'id': '1121756653541404702', travel: '1121756677973221406',
        course: '1121756703692685392',
        conference: '1121756725826031646',
    },
    Conferences: {
        'id': '1121756923323232336', design: '1121757199472005201',
        'launch-event': '1121757238588084296'
    },
    Internship: { 'id': '1121757310012903464', 'onsite': '1121757336600592385', 'remote': '1121757363179896872', 'hybrid': '1121757383862009917' },
    Meetup: {
        'id': '1121767943248818248', 'meet-up': '1121768105618706557',
        chat: '1121768161738493973',
        'voice-chat': '1121768196026933339',
    }
}

export async function findMemberId(username) {
    let id = undefined;
    await fetch(`${baseurl}/v9/guilds/${serverID}/members/search?query=${username}&limit=1`, {
        method: 'GET',
        headers: {
            'Authorization': `Bot ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response data
            data.forEach(element => {
                if (element.user.username.toLowerCase() == username.toLowerCase())
                    id = element.user.id;
                return;
            });
        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
        });

    return id;
}

export async function sendMessage(obj, discordUserID, category) {

    const embed_message = {
        "embeds": [
            {
                "title": obj.eventN,
                "color": category ? colors[category].code : colors["Default"].code,
                "fields": [
                    {
                        "name": "Link",
                        "value": obj.link,
                        "inline": false
                    },
                    {
                        "name": "Application Starts",
                        "value": obj.appS,
                        "inline": true
                    },
                    {
                        "name": "Application Ends",
                        "value": obj.appE,
                        "inline": true
                    },
                    {
                        "name": "\u00A0", // Zero-width space to create a new line
                        "value": "\u00A0", // Zero-width space to create a new line
                        "inline": false
                    },

                ]
            }
        ]
    }

    if (obj.eventS && obj.eventS.length > 0) {
        embed_message.embeds[0].fields.push({
            "name": "Event Starts",
            "value": "2023-06-23",
            "inline": true
        })
    }

    if (obj.eventE && obj.eventE.length > 0) {
        embed_message.embeds[0].fields.push({
            "name": "Event Ends",
            "value": "2023-06-25",
            "inline": true
        })
    }

    if (discordUserID) {
        embed_message.embeds[0].fields.push({
            "name": "Posted By",
            "value": `<@${discordUserID}>`,
            "inline": false
        })
    } else {
        embed_message.embeds[0].fields.push({
            "name": "Posted By",
            "value": obj.postedBy,
            "inline": false
        })
    }

    const jsonData = JSON.stringify(embed_message);

    const channelID = allChannels[category][obj.filters];

    let messageID = undefined;

    await fetch(`${baseurl}/v10/channels/${channelID}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bot ${token}`,
            'Content-Type': 'application/json'
        },
        body: jsonData,
    })
        .then(response => response.json())
        .then(data => {
            messageID = data.id;
        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
        });

    return messageID;
}

export async function editMessage(obj, discordUserID, category, messageID) {
    console.log("obj:", obj);
    const embed_message = {
        "embeds": [
            {
                "title": obj.eventN,
                "color": category ? colors[category].code : colors["Default"].code,
                "fields": [
                    {
                        "name": "Link",
                        "value": obj.link,
                        "inline": false
                    },
                    {
                        "name": "Application Starts",
                        "value": obj.appS,
                        "inline": true
                    },
                    {
                        "name": "Application Ends",
                        "value": obj.appE,
                        "inline": true
                    },
                    {
                        "name": "\u00A0", // Zero-width space to create a new line
                        "value": "\u00A0", // Zero-width space to create a new line
                        "inline": false
                    },
                ]
            }
        ]
    }

    if (obj.eventS && obj.eventS.length > 0) {
        embed_message.embeds[0].fields.push({
            "name": "Event Starts",
            "value": "2023-06-23",
            "inline": true
        })
    }

    if (obj.eventE && obj.eventE.length > 0) {
        embed_message.embeds[0].fields.push({
            "name": "Event Ends",
            "value": "2023-06-25",
            "inline": true
        })
    }

    if (discordUserID) {
        embed_message.embeds[0].fields.push({
            "name": "Posted By",
            "value": `<@${discordUserID}>`,
            "inline": false
        })
    } else {
        embed_message.embeds[0].fields.push({
            "name": "Posted By",
            "value": obj.postedBy,
            "inline": false
        })
    }

    const jsonData = JSON.stringify(embed_message);

    console.log("jsonData:",jsonData)

    const channelID = allChannels[category][obj.filters];

    await fetch(`${baseurl}/v10/channels/${channelID}/messages/${messageID}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bot ${token}`,
            'Content-Type': 'application/json'
        },
        body: jsonData,
    })
        .then(response => response.json())
        .then(data => {
            // console.log("data.id:", data.id);
        })
        .catch(error => {
            // Handle any errors
            // console.error('Error:', error.message_id);
        });

    return messageID;

}