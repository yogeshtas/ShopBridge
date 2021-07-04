// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
let org_location = location.origin.split(":");
let url = org_location[0]+":"+org_location[1];
console.log('url: '+url);
export const environment = {
  production: false,
  // loginAPI: "http://52.194.183.68:8100",192.168.192.220
  configAPI: "http://192.168.192.220:8100",
  reportURL: "http://192.168.192.220:8105",
  licenseAPI: 'http://192.168.192.220:8280',
  archiverestoreApiUrl: "http://192.168.192.220:8104",
  grafanaAPI: "http://192.168.192.220:8100/grafanaAPI",

  
  // // loginAPI: "http://127.0.0.1:8100",
  // configAPI: "http://127.0.0.1:8100",
  // reportURL: "http://127.0.0.1:8105",
  // licenseAPI: 'http://127.0.0.1:8280',
  // archiverestoreApiUrl: "http://127.0.0.1:8104"
  
  // configAPI: url+":8100",
  // reportURL: url+":8105",
  // licenseAPI: url+':8280',
  // archiverestoreApiUrl: url+":8104",
  // grafanaAPI: url+":8100/grafanaAPI",
};

/*
 * For easier debugging in development mode, you can import the following file
xxxxxxxx *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
