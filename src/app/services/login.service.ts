import { Injectable } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  constructor(private http: HttpClient, private router: Router) {}

  //== Parse JSON and add node (createData & updateData)
  parseAddNode(body, key, value) {
    let obj = JSON.parse(body); obj[key] = value;
    let newBody = JSON.stringify(obj);
    return newBody;
  }

  //== Login API
  login(data: any) {
    let body = JSON.stringify(data);
    body = this.parseAddNode(body, 'api_key', this.API_KEY); 
    return this.http.post(this.API_ENDPOINT, body)
      .pipe(
        map((res:Response) => res),
        catchError((res:Response) => throwError(this.handleError(res)))
      );
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
    localStorage.removeItem('loggedIn');
    this.changeRoute('home');
  }

  handleError(error) {
    return Observable.throw(error || 'Server error'); // return Observable.throw(error.json().error || 'Server error');
  }

}
