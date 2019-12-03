import Firebase from '../Firebase.js';

function dbList () {
  var user = Firebase.auth().currentUser;
  if (user === null) return null;
  var db = Firebase.firestore();
  const mapNames = [];
  const mapRef = db.collection(user.uid).get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      // doc.data() is never undefined for query doc snapshots
      mapNames.push(doc.id);
    });
  });
  return mapNames;
}
export default dbList;
