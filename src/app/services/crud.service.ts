import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import {map, catchError, retry} from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { promise } from 'protractor';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  // API endpoint and credentials
  private API_ENDPOINT = environment.api_endpoint_crud; //private API_ENDPOINT = 'http://localhost:8080/jd/examples/crud-superheroes-php/crud/index.php';
  private API_KEY = "jdr9175wz";

  constructor(private http: HttpClient) {}
  
  //== Add node to JSON (readData & updateData)
  addNode(key, value) {
    let obj = JSON; obj[key] = value;
    let body = JSON.stringify(obj);
    return body;
  }

  //== Parse JSON and add node (createData & updateData)
  parseAddNode(body, key, value) {
    let obj = JSON.parse(body); obj[key] = value;
    let newBody = JSON.stringify(obj);
    return newBody;
  }

  //== Create JSON body
  createBody(data, action, id) {
    let body;
    if(data != '') {
      body = JSON.stringify(data);
      body = this.parseAddNode(body, 'api_key', this.API_KEY); // add API KEY to JSON
      body = this.parseAddNode(body, 'api_action', action);    // add API ACTION to JSON
      body = this.parseAddNode(body, 'id', id);                // add API ID to JSON
    } else {
      body = this.addNode('api_key', this.API_KEY);            // add API KEY to JSON
      body = this.addNode('api_action', action);               // add API ACTION to JSON
      body = this.addNode('id', id);                           // add API FIELD (DB field) to JSON
    }
    return body;
  }

  // ---------------------
	//    CRUD API Calls
  // ---------------------
  
  //== Create
  createData(data: any): Observable<any> {
    let body = this.createBody(data, 'create', '');

    return this.http.post(this.API_ENDPOINT, body)
      .pipe(
        map((res:Response) => res),
        catchError((res:Response) => throwError(this.handleError(res)))
      );
  }

  //== Read and Sort
  readDataSort(data: any): Observable<any> {
    let body = this.createBody(data, 'readSort', '');

    return this.http.post(this.API_ENDPOINT, body)
    .pipe(
      map((res:Response) => res),
      catchError((res:Response) => throwError(this.handleError(res)))
    );
  }

  //== Read
  readData(id: number): Observable<any> {
    let body = this.createBody('', 'read', id);

    return this.http.post(this.API_ENDPOINT, body)
    .pipe(
      map((res:Response) => res),
      catchError((res:Response) => throwError(this.handleError(res)))
    );
  }

  updateData(data: any, id: number) {
    let body = this.createBody(data, 'update', id);

    return this.http.post(this.API_ENDPOINT, body)
    .pipe(
      map((res:Response) => res),
      catchError((res:Response) => throwError(this.handleError(res)))
    );
  }

  //== Delete
  deleteData(id: number): Observable<any> {
    let body = this.createBody('', 'delete', id);

    return this.http.post(this.API_ENDPOINT, body)
    .pipe(
      map((res:Response) => res),
      catchError((res:Response) => throwError(this.handleError(res)))
    );
  }

  handleError(error) {
    return throwError('service error returned from api: '+error); //return throwError(error || 'Server error');
  }

}

