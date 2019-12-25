import firebase from 'firebase-admin';

firebase.initializeApp({
    credential: firebase.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL, //'https://administratie-app.firebaseio.com',
});

export default firebase;
export const db = firebase.firestore();
export const auth = firebase.auth();

export class FirebaseClass {
    async get(key: string): Promise<void> {
        console.log(key);
    }

    async set(key: string, data: {}): Promise<void> {
        console.log(key, data);
    }

    async remove(key: string): Promise<void> {
        console.log(key);
    }
}
