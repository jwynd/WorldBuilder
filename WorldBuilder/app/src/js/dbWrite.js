// dbWrite
/* global size coastSmoothness inland beachHeight coastUniformity numRivers numMountainRanges widthMountainRange squiggliness mountainSmoothness img mapName */
import Firebase from '../Firebase.js';

function dbWrite () {
  var user = Firebase.auth().currentUser;
  if (user === null) return null;
  var db = Firebase.firestore();
  const data = {
    mapName: mapName,
    size: size,
    coastSmoothness: coastSmoothness,
    inland: inland,
    beachHeight: beachHeight,
    coastUniformity: coastUniformity,
    numRivers: numRivers,
    numMountainRanges: numMountainRanges,
    widthMountainRanges: widthMountainRange,
    squiggliness: squiggliness,
    mountainSmoothness: mountainSmoothness,
    img: img
  };
  db.collection(user.uid).doc(mapName).set(data);
}
export default dbWrite;
