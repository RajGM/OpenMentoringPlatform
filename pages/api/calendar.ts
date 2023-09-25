
const { google } = require('googleapis');

const nameToCalID = {
    "Hackathon": "759d718fecf97c35ed0e8962a893d7a35af08c700458908baa458c87c80ca2c5@group.calendar.google.com",
    "Grants": "60b02992409cbd6122c3d7d129b0c963b5214e26cb36ef9faf3d522305645b4c@group.calendar.google.com",
    "Conferences": "7d6a6c2b83c91541e36590cb712f54c087cc15a29c42e9e10db07397e4e9069f@group.calendar.google.com",
    "Internship": "6588c33175b4ef8668d114b267979a361be4cd69816361b730312e3d3f416965@group.calendar.google.com",
}

const data = {
    "type": "service_account",
    "project_id": "infiopp-c399a",
    "private_key_id": "9f37bd81ffdb9a1b9bea6852310ac3166d355b74",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCT0q3T/x2ToWxE\nt64SnTT/nyq9pNm7aQctHGKsM1nN9a5tRDEif2t/Q91S2bDdaSnTWkD8ZZM0h2Xd\nc0tBLueFvfLRZD+zBtAMLZ3U/XbALruODuCHmAKmwA/WEwPJzA/9Q/kNzqGkczLc\nPlnSagQrsvJbv0Ru9GpSM9p73NhntlLB5RV+he9atGBDgN6kQ5GLdXZsUolOE6KW\n5V7qnrewG+B3jC7vHV4El8jw/u3ehSEyU6z51zVYzEUh7PZLWMRgG5l+N43/Nx8v\nIbAJxALWouRp01GaBYo3zWO4kt0cylMl2L98DEk+319+SwhMtJlsIL8sJ33WUq3y\nFuehJTnpAgMBAAECggEAAIU9oPE1QrOPDMfjyEN+8AZ4sU2/CYKjaJSAwW/12TyL\n9m0GykMOFxbfVN8Y2RK5d7nJ4EmgRM9UO70f7vUSEh262ONkOQZlXaGcfGc/D4qq\nlOO3BSszGTC0bZHIEeISzVa7rgGD/q78JxveF5hRdvDsmweXn1djd3Igyw5aQbU4\ngxOSP+0aHsfs9qwV5Y9gyZLQt9f3d84kRmnBGOSdTksK0CHRxODITmuTXI/zu4FT\njR50cUUOtlKU3eAImkrVuyQ3KLbypShDAnYYXt4U6R+reanOev9rf4F57Nah04qB\nIaZarL9pQ/Nbzsz+by2sDn94NSUafkt1E5I8y1+sHQKBgQDHbJN7fymfMznTzEHw\nslN4opgKuwnMCQFsTnnoaXAZrgWsW235IursLff4J8FaY1Oas/33vb/R+RD0zN1r\n2Uc4glvgZtdCyxW6gJ9sCYQrpBtueqMnIXFhygwSxlLi1M+nrXs71cI/NRHNCLA6\ni5k9/Jj8E3Y51+9FvhAQ3pP75QKBgQC9woE47PEzt2A0tm256vn5WD+PBJA6nFEV\nN3futsEeP9QTMDfWKv7t3oVucul8yRC8FXy/P2tye/k7TSDC8SrCiBrq0M8dUr4x\nH43S4YQKAMsGn0Yx5j68npktGHYoIVZIj2bckWRfng0TztsqwUQlKZuA9WaA2P/6\nnaDrtzuNtQKBgHkQD8Qz4SeVKHDMGeetygB87EHvY7YqbWO7jEQr5fKg8y673loU\n+XphOZy7PaTKkZFj3TRNS6qDQejqiSyUnajPckkbBWi18r3ioWUrrcH0gPajmnIB\n2lvcFVI8dUrgmCMZrKsZTC+k3uaSdLFF18SKmLDGe8oHrWiwRf6HsFyFAoGBAIcf\nWLr7ZeoImxYODWZFH0lhgKjLfBRwOQCdpeYy9qMemlorjKcRqMQjHup+Iyr7VdJI\njrL0awNzqg6DJmAKMQOivWAV3lWoFMyQBoJymX4yAGAvzGE97dCMMtC8yW5cBr/W\ndU18rnez6OYA92mjg23fCd8zX5FCdEy2L9+Jc3u9AoGAc5jxTe04wtDO1ll55bVr\nwt66X+NwAata0qIY+ocQcd7pS13hoLWks6iMQZz2zNKoQa1C4ZHegM6zKffyI41m\n3XRsIORPlDSS7aakW4alW8P5NQNI5xqAv/GIFa3javnNDPIMnWG/x6BY1Ipj14P+\nY1TysW85SLeiWmsaqZnhWbg=\n-----END PRIVATE KEY-----\n",
    "client_email": "infioppcalendar-438@infiopp-c399a.iam.gserviceaccount.com",
    "client_id": "110996239970231537054",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/infioppcalendar-438%40infiopp-c399a.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com",
}

const auth = new google.auth.GoogleAuth({
    credentials: data,
    scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth: auth });

export async function addCalendarEvent(title:string, url:string, applicationStarts:any, applicationEnds:any,category:string) {

    const calIDbyName = nameToCalID[category];
    
    const calID = await calendar.events.insert({
        calendarId: calIDbyName,
        resource: {
            summary: title,
            "location": url,
            "description": "Hackathon",
            start: {
                dateTime: `${applicationStarts}T00:00:00-00:00`,
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: `${applicationEnds}T00:00:00-00:00`,
                timeZone: 'Asia/Kolkata',
            },
        },
    }).then((res) => {
        return res.data.id;
    }).catch((err) => {
        return err;
    });

    return calID;

}

export async function editCalendarEvent(id:any, title:string, url:string, applicationStarts:any, applicationEnds:any,category:string) {
    
    const calIDbyName = nameToCalID[category];
    
    const response = await calendar.events.update({
        calendarId: calIDbyName,
        eventId: id,
        resource: {
            summary: title,
            "location": url,
            "description": "Hackathon",
            start: {
                dateTime: `${applicationStarts}T00:00:00-00:00`,
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: `${applicationEnds}T00:00:00-00:00`,
                timeZone: 'Asia/Kolkata',
            },
        },
    }).then((res) => {
        return res.data;
    }
    ).catch((err) => {
        return err;
    }
    );

    return response.id;

}