// will require and run our main fetch function

const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');


fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
});

fetchCoordsByIP((error, coords) => {
  if (error) {
    console.log("It didn't work! Error: Success status was false. Server message says: Invalid IP address when fetching for IP");
    return;
  }

  console.log('here are your coordinates', coords);
});


const coordinates = { latitude: 43.7315479, longitude: -79.7624177 };
fetchISSFlyOverTimes(coordinates, (error, data) => {
  if (error) {
    console.log('It didnt work!', error);
    return;
  }
  console.log('it worked!', data)
});

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};


nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didnt work!", error)
  }
  printPassTimes(passTimes);
})