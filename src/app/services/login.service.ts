import { Injectable } from '@angular/core';
//import {Http, Response, Headers, RequestOptions} from "@angular/http";

import {HttpClientModule} from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//import {Observable} from 'rxjs';
//import 'rxjs/Rx';
//import {Observable} from "rxjs/Rx";
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
import {map, catchError} from "rxjs/operators";
import { Observable, throwError } from 'rxjs';

import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // API endpoint and credentials
  private API_ENDPOINT = 'http://localhost:8080/test/angular2/ng2-rtrans/php/login/index.php';
  private API_KEY = "jdr9175wz";

  public userData: any;
  public userJSON: any;

  //this.userData = localStorage.getItem("currentUser");
  //this.userJson = JSON.parse(this.userData);

  constructor(private http: HttpClient, private router: Router) {}

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

  //== Add headers to JSON
	// addHeaders() {
  //   let headers = new Headers({ 'Content-Type': 'application/json' });
  //   headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
  //   let options = new RequestOptions({ headers: headers });
  //   return options;
  // }

  //== Parse JSON and add node (createData & updateData)
  parseAddNode(body, key, value) {
    let obj = JSON.parse(body); obj[key] = value;
    let newBody = JSON.stringify(obj);
    return newBody;
  }

  //== Login API
  login(data: any) {
    let body = JSON.stringify(data);
    body = this.parseAddNode(body, 'api_key', this.API_KEY); // add API KEY to JSON
    //let options = this.addHeaders();

    //console.log('LOGIN SERVICE -> data: '+body);
    return this.http.post(this.API_ENDPOINT, body) // return this.http.post(this.API_ENDPOINT, body, options)
      //.map((res: Response) => res.json())
      .pipe(
        map((res:Response) => res),
        catchError((res:Response) => throwError(this.handleError(res)))
      );
      // .map((response: Response) => {

      //   // event.stopImmediatePropagation;
      //   // event.preventDefault();
      //   // event.stopPropagation();
      //   let res = response.json();
      //   localStorage.setItem('loggedIn', JSON.stringify(res)); //localStorage.setItem('key', 'value');
      //   this.changeRoute('heroes');

      //   //console.log('LOGIN SERVICE -> response: '+res);
      //   return response.json();

      // })
      // .catch(this.handleError);
  }

  // Change the route (current page)
  changeRoute(page) {
    let parentRouter = Router;
    this.router.navigate(['./'+page]);
  }

  //== Check Login Status
  loginStatus() {
    let status = localStorage.getItem("loggedIn");
    return status;
  }

  //== Logout User
  logout() {
    localStorage.removeItem('loggedIn'); // remove user from local storage to log user out
    this.changeRoute('home');
  }

  //== Error Handling
  // handleError(error) {
  //   console.log('SERVER ERROR FROM API: '+error);
  //   // return Observable.throw(error.json().error || 'Server error');
  //   return Observable.throw(error || 'Server error');
  // }
  handleError(error) {
    console.log('SERVER ERROR FROM API: '+error);
    return Observable.throw(error || 'Server error'); // return Observable.throw(error.json().error || 'Server error');
  }

}
