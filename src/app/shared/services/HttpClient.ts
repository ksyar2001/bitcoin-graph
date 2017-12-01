import {Injectable} from '@angular/core';
import {Http, URLSearchParams, RequestOptions, RequestMethod, Request} from '@angular/http';
import {Headers} from '@angular/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {Observable} from 'rxjs/Rx'

@Injectable()
export class HttpService {
  private base_url: string;

  constructor(private http: Http, private router: Router) {
    this.base_url = "http://localhost:3000/api/";
  }

  private setHeaders(): Headers {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    return new Headers(headersConfig);
  }

  get(url, data?: any): Observable<any> {
    if (!data) {
      var options = new RequestOptions({headers: this.setHeaders(), withCredentials: true});
    }
    else {
      let parameters = new URLSearchParams();
      for (let key in data) {
        if (data.hasOwnProperty(key)){
          parameters.set(key, data[key])
        }
      }
      var options = new RequestOptions({
        headers: this.setHeaders(),
        search: parameters,
        withCredentials: true
      })
    }
    // console.log(options)
    return this.http.get(`${this.base_url}${url}`, options)
    // .map(res => console.log(res))
    .catch((error:any) => {return this.handleError(error)});
  }

  handleError(error) {
    console.log(error);
    this.router.navigate([`/${error.status}`]);
    return Observable.throw(error.json());
  }
}