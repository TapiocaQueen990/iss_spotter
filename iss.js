// will contain most of the logic to fetch data from each api
/*
* Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');


const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(callback) {
  request('https://ipwho.is/', (error, response, body) => {
    const parsedBody = JSON.parse(body);
    // check if "success" is true or not
    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }
    if (error) return callback(error);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Lat/Long`), null);
      return;
    }

    let coords = {};
    const lat = JSON.parse(body).latitude;
    const long = JSON.parse(body).longitude;
    coords.latitude = lat;
    coords.longitude = long;
    callback(error, coords);
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) {callback(error, null)
    return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status code ${response.statusCode} when fetching data`), null);
      return;
    }

    const data = JSON.parse(body).response;
    callback(null, data);

  })
}
const nextISSTimesForMyLocation = function(callback) {
fetchMyIP((error, ip) => {
  if (error) {
    return callback(error, null);
  }
  fetchCoordsByIP(ip, (error, loc) => {
    if (error) {
      return callback(error, null);
    }
    fetchISSFlyOverTimes(loc, (error, nextPasses) => {
      if (error) {
        return callback(error, null);
      }

      callback(null, nextPasses);
    })
  })
})
}

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };
