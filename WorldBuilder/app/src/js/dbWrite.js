// dbWrite
import Firebase from '../Firebase.js';
import {
  mWidth, mHeight, mapName, size, coastSmoothness, islandArea, islandCircumference,
  inland, beachHeight, coastUniformity, numRivers, numMountainRanges, widthMountainRange,
  squiggliness, mountainSmoothness, worldSeed
} from './main.js';

function dbWrite () {
  var user = Firebase.auth().currentUser;
  if (user === null) return null;
  var db = Firebase.firestore();
  if (mapName === undefined) {
    console.error('imported variable mapName in dbWrite undefined');
  }
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
    mWidth: mWidth,
    mHeight: mHeight,
    islandArea: islandArea,
    islandCircumference: islandCircumference,
    worldSeed: worldSeed
  };
  db.collection(user.uid).doc(mapName).set(data);
}
export default dbWrite;
