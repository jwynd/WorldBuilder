// dbWrite
/* global size coastSmoothness inland beachHeight coastUniformity numRivers numMountainRanges widthMountainRange squiggliness mountainSmoothness img mapName */
import Firebase from '../Firebase.js';

function dbRead (mapName) {
  var db = Firebase.firestore();
  const mapRef = db.collection('maps').doc(mapName);
  const getDoc = mapRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.error('No such document');
      } else {
        const docData = doc.data();
        size = docData.size;
        coastSmoothness = docData.coastSmoothness;
        inland = docData.inland;
        beachHeight = docData.beachHeight;
        coastUniformity = docData.coastUniformity;
        numRivers = docData.numRivers;
        numMountainRanges = docData.numMountainRanges;
        widthMountainRange = docData.widthMountainRange;
        squiggliness = docData.squiggliness;
        mountainSmoothness = docData.mountainSmoothness;
        img = docData.img;
        mapName = docData.mapName;
      }
    })
    .catch(err => {
      console.err('Error getting document', err);
    });
}
export default dbRead;
