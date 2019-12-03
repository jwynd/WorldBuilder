// dbWrite
import Firebase from '../Firebase.js';

function dbRead (mapName) {
  var user = Firebase.auth().currentUser;
  if (user === null) return null;
  var db = Firebase.firestore();
  const mapRef = db.collection(user.uid).doc(mapName);
  const getDoc = mapRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.error('No such document');
      } else {
        return doc.data();
      }
    })
    .catch(err => {
      console.error('Error getting document', err);
    });
  return getDoc;
}
export default dbRead;
