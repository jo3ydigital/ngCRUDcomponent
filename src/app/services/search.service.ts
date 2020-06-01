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

  private API_ENDPOINT = environment.api_endpoint_search;
  private API_KEY = "jdr9175wz";

  constructor(private http: HttpClient) {}
  
  //== Add node to JSON
  addNode(key, value) {
    let obj = JSON; obj[key] = value;
    let body = JSON.stringify(obj);
    return body;
  }

  //== Search terms (fired on keyup event from search input)
	search(terms: Observable<string>, field) {
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

    return this.http.post(this.API_ENDPOINT, body)
      .pipe(
        map((res:Response) => res),
        catchError((res:Response) => throwError(this.handleError(res)))
      );
  }
  
	//== Error Handling
  handleError(error) {
    return throwError('service error returned from api: '+error);
  }

}
