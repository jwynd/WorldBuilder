import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBYNTCRZrUuNlhZD5C-1umjaoCGVoY_x24",
    authDomain: "worldbuilder-6346f.firebaseapp.com",
    databaseURL: "https://worldbuilder-6346f.firebaseio.com",
    projectId: "worldbuilder-6346f",
    storageBucket: "worldbuilder-6346f.appspot.com",
    messagingSenderId: "443368502877",
    appId: "1:443368502877:web:fe8ed29afcdd5268f87fb4",
    measurementId: "G-3N8NQGFVN7"
  };

firebase.initializeApp(firebaseConfig);
export default firebase;