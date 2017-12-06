import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {HttpService} from './HttpClient';
import {Observable} from 'rxjs/Rx'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';

@Injectable()
export class ServerService {
	private socket;
	socket_url = 'http://localhost:3000';

  constructor(private http: HttpService) {}

  getResponse(): Observable<any> {
  	let query_url = `posts`;
  	return this.http.get(query_url).map(res => res.json())
  }

  getMessages() {
  	let observable = new Observable(observer => {
  		this.socket = io(this.socket_url);
  		this.socket.on('message', (data) => {
  			observer.next(data);
  		});
  		return () => {
  			this.socket.disconnect();
  		}
  	})
  	return observable;
  }

}
