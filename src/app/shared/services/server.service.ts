import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {HttpService} from './HttpClient';
import {Observable} from 'rxjs/Rx'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ServerService {

  constructor(private http: HttpService) {}

  getResponse(): Observable<any> {
  	let query_url = `posts`;
  	return this.http.get(query_url).map(res => res.json())
  }

}
