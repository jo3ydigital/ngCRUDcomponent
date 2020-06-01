import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map, catchError} from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private API_ENDPOINT = environment.api_endpoint_search; //private API_ENDPOINT = 'http://localhost:8080/jd/examples/crud-superheroes-php/search/index.php';
  private API_KEY = "jdr9175wz";

  //constructor(private http: Http) { }
  constructor(private http: HttpClient) {}
  
  
  //== Add headers to JSON
	// addHeaders() {
  //   let headers = new Headers({ 'Content-Type': 'application/json' });
  //   headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
  //   let options = new RequestOptions({ headers: headers });
  //   return options;
  // }
  // addHeaders() {
  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': 'http://localhost:4200'
  //   });
  //   let options = {
  //     headers: headers
  //   }
  //   return options;
  // }
  
  //== Add node to JSON
  addNode(key, value) {
    let obj = JSON; obj[key] = value;
    let body = JSON.stringify(obj);
    return body;
  }

  //== Search terms (fired on keyup event from search input)
	search(terms: Observable<string>, field) {
    // return terms.debounceTime(400)
    //   .distinctUntilChanged()
    //   .switchMap(term => this.searchEntries(term, field));
    return terms
    .pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => this.searchEntries(term, field)))
    };

  //== Search Service
	searchEntries(term, field) {
    let body = this.addNode('api_key', this.API_KEY); // add API KEY to JSON
		body = this.addNode('api_action', 'search');      // add API ACTION to JSON
		body = this.addNode('field', field);              // add API FIELD (DB field) to JSON
		body = this.addNode('terms', term);               // add API TERMS (search terms) to JSON
    //let options = this.addHeaders();                  // add HEADERS (options) to request

    //console.log('SEARCH SERVICE: '+body);
    return this.http.post(this.API_ENDPOINT, body) //return this.http.post(this.API_ENDPOINT, body, options)
      // .map((res: Response) => res.json())
      // .catch(this.handleError);
      .pipe(
        map((res:Response) => res),
        catchError((res:Response) => throwError(this.handleError(res)))
      );
  }
  
	//== Error Handling
	// handleError(error) {
  //   console.log('SEARCH API ERROR: '+error);
  //   // return Observable.throw(error.json().error || 'Server error');
  //   return Observable.throw(error || 'Server error');
  // }
  handleError(error) {
    //console.log('SERVER ERROR FROM API: '+error);
    return throwError('service error returned from api: '+error); //return Observable.throw(error || 'Server error'); // return Observable.throw(error.json().error || 'Server error');
  }

}
