import { Component, OnInit } from '@angular/core';
import { HttpService } from '../shared/services/HttpClient';
import { ServerService } from '../shared/services/server.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private server: ServerService) { }

  ngOnInit() {
  	this.server.getResponse().subscribe(res => console.log(res))
  }

}
