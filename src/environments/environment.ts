// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  baseUrl: 'https://staging-api.ososweb.com',
  baseUrlLocal: 'http://192.168.0.254:3012',
  production: false,
  websocket: 'wss://chat.spaarksweb.com:5280/websocket',
  // websocket: 'ws://103.27.86.24:5280/websocket',
  mapsUrl: 'https://maps.spaarksweb.com/styles/ososweb/',
  base: 'https://staging-api.ososweb.com/',
  baseMap: 'https://maps.spaarksweb.com/styles/ososweb/',
  ijaia: 'bGThac',
  ijaiaahut: 'kwOZp',
  qrcodeUrl: 'https://staging-api.ososweb.com/api/v2.0/view/createId',
  checkStatus: 'https://staging-api.ososweb.com/api/v2.0/view/checkStatus',
  user: 'https://staging-api.ososweb.com/api/v2.0/user/add/aliasname/name'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
