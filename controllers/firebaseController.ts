import * as firebase from 'firebase-admin';


export default class Firebase {

    client: firebase.app.App;

    constructor() {
        this.client = firebase.initializeApp({
            credential: firebase.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID, // I get no error here
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL, // I get no error here
                privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n')
            })
        });
    }
}