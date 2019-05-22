// const URL = 'https://api.luftdaten.info/static/v2/data.dust.min.json'
// const URL = 'https://api.luftdaten.info/v1/filter/area=48.800000,9.200000,50'
// const URL = 'https://api.airquality.codeforafrica.org/v2/sensors/?type=PPD42NS,HPM,PMS1003,PMS3003,PMS5003,PMS6003,PMS7003,SDS021,SDS011'
//const URL = "https://api.sensors.africa/v2/nodes/";

const URL = "http://staging.api.sensors.africa/v2/nodes/";

import _ from "lodash";
import "whatwg-fetch";

let api = {
  fetchNow() {
    return fetch(URL).then(response => response.json());
  },
  // fetches from /now, ignores non-finedust sensors
  // /now returns data from last 5 minutes, so we group all data by sensorId
  // and compute a mean to get distinct values per sensor
  getAllSensors() {
    return api.fetchNow().then(json => { 
      function(i) {
        for (let i in json) {
          if (json[i].node_moved == true) {
            return json
          } else return null;
        }
      };
      console.log(json)
      let cells = _.chain(json)
        .filter(json => json.node_moved == true)
        .map((value, key) => {
          ///let id = function(id) {
          //for (let i in value.stats) {
          //return Number(value.stats[i].sensor_id);
          //}
          //};
          //console.log(id());

          //let id = function(id) {
            //for (let i in value.stats) {
              //if (value.node_moved == true) {
                //return Number(value.stats[i].sensor_id);
              //} else return null;
            //}
          //};
          ///console.log(id());
          let lat = Number(value.location.latitude);
          let long = Number(value.location.longitude);
          let location = value.location.name;
          let date = new Date(value.last_data_received_at);
          //let sensorsMoved = Boolean(value.sensors_moved);
          let P1 = value.stats.find(s => s.value_type === "P1");
          let P2 = value.stats.find(s => s.value_type === "P2");
          return {
            latitude: lat,
            longitude: long,
            location: location,
            date: date.toLocaleDateString(),
            //sensorsMoved: sensorsMoved,
            id: id(),
            data: {
              P1: P1 ? P1.average : 0,
              P2: P2 ? P2.average : 0
            }
          };
        })
        .value();
      return Promise.resolve(cells);
    });
  }
};

export default api;
