import firebase from "firebase/app"; 
import 'firebase/firestore'
import 'firebase/auth'
  
 // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyARChRknUCjssKY5IDokGprSbt5BLWOtis",
    authDomain: "erap-47584.firebaseapp.com",
    databaseURL: "https://erap-47584.firebaseio.com",
    projectId: "erap-47584",
    storageBucket: "erap-47584.appspot.com",
    messagingSenderId: "954554155054",
    appId: "1:954554155054:web:f6e5cb25b23b13278adfbf",
    measurementId: "G-MY0ZW2RC9Q"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();
  firebase.firestore().settings({timestampInSnapShots: true})

export default firebase
export const auth = firebase.auth();
export const firestore = firebase.firestore();
//export const storage = firebase.storage();

export const generateUserDocument = async (user, additionalData) => {
    console.log("...generateUserDocument", user , additionalData)
    if (!user) return;
    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
      const { email, displayName } = user;
      try {
        await userRef.set({
          displayName,
          email,
          ...additionalData
        });
      } catch (error) {
        console.error("Error creating user document", error);
      }
    }
    return getUserDocument(user.uid);
  };

  const getUserDocument = async uid => {
    if (!uid) return null;
    try {
      const userDocument = await firestore.doc(`users/${uid}`).get();
      return {
        uid,
        ...userDocument.data()
      };
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };