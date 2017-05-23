import * as firebase from 'firebase';

firebase.initializeApp({
    apiKey: "AIzaSyCS7aKYqRN4Tfm0zPmaB1PtYn4zRDOfo7A",
    authDomain: "final-project-feb7f.firebaseapp.com",
    databaseURL: "https://final-project-feb7f.firebaseio.com",
    projectId: "final-project-feb7f",
    storageBucket: "final-project-feb7f.appspot.com",
    messagingSenderId: "559514574849"
});

export const auth = firebase.auth(); 
export const database = firebase.database();