// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  base_url: 'http://localhost:8080/jd/examplescrud-superheroes',
  css_base_path: 'http://localhost:8080/jd/examples/crud-superheroes/assets', 
  api_endpoint_crud: 'http://localhost:8080/jd/examples/crud-superheroes-php/crud/index.php',
  api_endpoint_search: 'http://localhost:8080/jd/examples/crud-superheroes-php/search/index.php'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
