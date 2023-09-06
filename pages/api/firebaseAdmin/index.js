import admin from 'firebase-admin';

const adminConfig ={
    "type": "service_account",
    "project_id": "foss-mentoring",
    "private_key_id": "1c9d949be494ffe6e293645ba82bf0f115c0b63e",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDYYoEmKCUVgVrx\nJa94mq4yJFfRy8mCE/QBzPQFRCBJU0gmmKK/ebBu6gnIoJMqWxrb2dub0ciY2Dpq\n/a3OaB0nRBlsSKr0kJJ5bJ6801smLAAgxwx+rpNnrBqR++Y6FZdDNPZzYQN321If\nIoDNcMi6vwGIjhlXJhgbJSRoGqkqUm7Z0MwUM98AGFCdZwPm1qUW/2jeueKE3Co1\nbUlSz8SpBq7qKLUhpXFkJ+M3Rg5/F7G6MaEBxwfBkocqBkJEKdjn6Y8wfcVHAfbp\nq7e/qq92CTXR2OCjBvznhvP85ZOpbczyJTpTOPAx/p5kgFzeWA6QVdKbhPyb8s6V\ncG18VjD9AgMBAAECggEAVoDen3nqBVRenkvR/7VakSoNP44n4wwF/phILzjCbX3R\nOLjJSyGjQlvmiGGFI6gjLyPDUuIFPvEmPXJngr4FdZaYUT0ltrp7C/a76MHXzQVH\nEdNxL82rmQTo5FZe/fZ2r4PjSFHOuKIhjNfWxQpi/KDyRHyGLdxJQ8TP7pxF52gr\nnw7NZSl/qc2dw5VI/lLHd/pbAx00yGh1m8itbRc/lohF+FtHKmF63W4OykZ2Yyle\nSvACLPamUf9NlJdblZhq1agnzuY3fKI0g6TwAeIU/c+BhVbj1VaV2yVECnVk+N27\n5gC6ycYxSF5HPK3B+MmroICMCwS0ufHqXwv53wXjUwKBgQD0YD8mqU3W1NcxqEHd\nndosQMv45YDYuIktodAY5uyhCNAoeEWBfnS4lBjFCaZcEOytCUUO0TVoVRsACIcM\nbWc6bkFvCFqIrW7JPtQroim4g1L9QP0mJVRFTv9lq7V/gMnH29t3pOL8spUWwJ+9\nFKqnhf17Sdty4YXT9Eoq+shdJwKBgQDirWkhY8bCziggJxIKkC5mXx8MyB2Y0Bku\nH7ccKwUDm5ozcTw8iZaiBvgNBYt71SndozoTLyiarujjLme+PDlg7kQeMTb+wnNl\nbFTSdvBBNIkOKlNINH+E6RO4vwz5+W3ijGuhIbHI99Jl4tLL5jtzrEB2+1sbdECp\n4/7eOrcfOwKBgQCnFq/XNWedfkXtFAiFCQtFusA8XF+uzu4snzjz7eDZcncxVJrh\noZ8ZHVmaT7DJvmC1J2NqcC0+OwKNEUeVfbBZSU3AJ0wPq9XWD/luJCC2okQ6GRd9\n34QxJ4SE9dTRazOMTY1PzxPMiCZcOjR+SgUtKfZZN/SuJfklJSEZJgOdfQKBgQCv\ns7jMr9lOAJxrp709QNsmcM7RioAehhcugFjf1ZyyWjdhboFBb2i6OOqmtUiT+PvV\nl4MZgbFYjQFprvutImNbdfSI7p7xQ+pMkHcDGDxMXptpxnb9fevmKwAlcLlvPd7l\n/vAiWsrCuw1z+iho8hHdLIRfdZ/+HNNOnLJesWZmJwKBgQDy/63NfBxEVMs0jeQJ\nSTIQjEWCeTh15XqhW0gqGxNoBP9pxRUwt0G6qSGohoUIMajLBQMv4dzRJsqv7rXu\nMhIeQyEC1Mos1kWuv0fN0QnEpmTGbFNE53RipQ3LYSpnTGj26gViQLAZ4Ooi6eDW\nD6j1/UDu0mnD+loxc9amvrbwzA==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-wn1dw@foss-mentoring.iam.gserviceaccount.com",
    "client_id": "100037564493517894356",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wn1dw%40foss-mentoring.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  };  

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(adminConfig)
    });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const arrayPush = admin.firestore.FieldValue.arrayUnion;
export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

export async function generateFirebaseID(collection) {
    const newRef = push(ref(db, collection));
    console.log("New ID generated:", newRef.key);
    return newRef.key;
}

export async function writeToFirestore(category,data) {
    const collectionRef = db.collection(category,data); // Use the name of your collection

    try {
        const docRef = await collectionRef.add(data);
        console.log('Document written with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error writing document:', error);
        return null;
    }
    
}

export async function updateToFirestore(category,data,docID) {
    const collectionRef = db.collection(category); 

    try {
        const documentRef = collectionRef.doc(docID);
        await documentRef.update(data);
        console.log('Document updated successfully');
    } catch (error) {
        console.error('Error updating document:', error);
    }
    
}